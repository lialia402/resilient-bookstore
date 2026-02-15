"""
In-memory data store: books (from JSON), favorites, cart.
Loaded at import; state is process-local.
"""
import json
import random
from pathlib import Path

# Path to books.json (relative to this file)
_DATA_DIR = Path(__file__).resolve().parent / "data"
_BOOKS_PATH = _DATA_DIR / "books.json"

# All books from JSON (list order preserved for pagination)
books: list[dict] = []
# id -> book for lookup
books_by_id: dict[str, dict] = {}
# Favorite book ids (in-memory)
favorites: set[str] = set()
# Cart: list of { "bookId": str, "quantity": int }
cart: list[dict] = []

# Discount codes: code (upper) -> { "type": "percent"|"fixed", "value": int|float, "message": str }
DISCOUNT_CODES: dict[str, dict] = {
    "SAVE10": {"type": "percent", "value": 10, "message": "10% off"},
    "SAVE20": {"type": "percent", "value": 20, "message": "20% off"},
    "FLAT5": {"type": "fixed", "value": 5, "message": "$5 off"},
}


def load_books() -> None:
    global books, books_by_id
    if not _BOOKS_PATH.exists():
        books = []
        books_by_id = {}
        return
    raw = json.loads(_BOOKS_PATH.read_text(encoding="utf-8"))
    books = raw
    books_by_id = {b["id"]: b for b in books}


def filter_books(q: str = "", author: str = "") -> list[dict]:
    """
    Return books filtered by q and/or author. Case-insensitive substring match.
    q searches BOTH title and author (single search bar).
    author is an optional additional filter for precision.
    """
    out = books
    if q:
        q_lower = q.strip().lower()
        out = [
            b for b in out
            if q_lower in b.get("title", "").lower()
            or q_lower in b.get("author", "").lower()
        ]
    if author:
        a_lower = author.strip().lower()
        out = [b for b in out if a_lower in b.get("author", "").lower()]
    return out


def get_book_for_list(book: dict) -> dict:
    """Book list item: include favorite, omit full description for list view."""
    bid = book["id"]
    return {
        "id": bid,
        "title": book["title"],
        "author": book["author"],
        "price": book["price"],
        "stock": book["stock"],
        "favorite": bid in favorites,
    }


def get_book_detail(book_id: str) -> dict | None:
    """Full book for detail view: description, reviews, favorite."""
    book = books_by_id.get(book_id)
    if not book:
        return None
    return {
        **book,
        "favorite": book_id in favorites,
    }


class FavoriteResult:
    """Three-way result: not_found / simulated_failure / success."""
    __slots__ = ("state", "status")

    NOT_FOUND = "not_found"
    FAILURE = "failure"
    OK = "ok"

    def __init__(self, state: bool, status: str) -> None:
        self.state = state
        self.status = status


def toggle_favorite(book_id: str, force_fail: bool = False) -> FavoriteResult:
    """
    Toggle favorite for book_id.
    force_fail=True always simulates failure (for deterministic testing).
    Otherwise 20% random failure for rollback demo.
    """
    if book_id not in books_by_id:
        return FavoriteResult(False, FavoriteResult.NOT_FOUND)
    if force_fail or random.random() < 0.2:
        return FavoriteResult(book_id in favorites, FavoriteResult.FAILURE)
    if book_id in favorites:
        favorites.discard(book_id)
        return FavoriteResult(False, FavoriteResult.OK)
    favorites.add(book_id)
    return FavoriteResult(True, FavoriteResult.OK)


def get_cart_response() -> dict:
    """Build { items, totalItems, totalPrice } from cart + books."""
    items = []
    total_items = 0
    total_price = 0.0
    for row in cart:
        bid = row.get("bookId")
        qty = row.get("quantity", 0)
        if not bid or qty <= 0:
            continue
        book = books_by_id.get(bid)
        if not book:
            continue
        total_items += qty
        total_price += book["price"] * qty
        items.append({
            "bookId": bid,
            "title": book["title"],
            "author": book["author"],
            "price": book["price"],
            "quantity": qty,
        })
    return {
        "items": items,
        "totalItems": total_items,
        "totalPrice": round(total_price, 2) if total_price else 0,
    }


def add_to_cart(book_id: str, quantity: int = 1) -> bool:
    """Add or update quantity for book_id. Returns True if book exists."""
    if book_id not in books_by_id or quantity <= 0:
        return False
    for row in cart:
        if row.get("bookId") == book_id:
            row["quantity"] = row["quantity"] + quantity
            return True
    cart.append({"bookId": book_id, "quantity": quantity})
    return True


def clear_cart_mut(simulate_failure: bool = False) -> bool:
    """
    Clear cart. Returns True on success.
    If simulate_failure True, returns False (for rollback demo).
    """
    if simulate_failure:
        return False
    cart.clear()
    return True


def validate_discount(code: str) -> dict:
    """Return { valid, type, value, message }. No adjusted price."""
    if not code or not code.strip():
        return {"valid": False, "type": "percent", "value": 0, "message": "No code entered"}
    key = code.strip().upper()
    if key in DISCOUNT_CODES:
        d = DISCOUNT_CODES[key]
        return {
            "valid": True,
            "type": d["type"],
            "value": d["value"],
            "message": d["message"],
        }
    return {"valid": False, "type": "percent", "value": 0, "message": "Invalid code"}


# Load on import
load_books()
