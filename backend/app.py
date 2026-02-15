"""
Resilient Bookstore — Flask API.
Phase 2: books (list, detail, favorite), cart, discount.
"""
import random
import time
from flask import Flask, request

from flask_cors import CORS

from data_store import (
    FavoriteResult,
    clear_cart_mut,
    filter_books,
    get_book_detail,
    get_book_for_list,
    get_cart_response,
    add_to_cart,
    toggle_favorite,
    validate_discount,
)

# Artificial delay (seconds) so optimistic updates are visible in demo
API_DELAY = 0.5

app = Flask(__name__)
CORS(app)

# Default page size for list
DEFAULT_LIMIT = 20


@app.get("/health")
def health():
    return {"status": "ok"}


# —— Books ——

@app.get("/books")
def list_books():
    """
    GET /books?cursor=&limit=&q=&author=
    Response: { "items": [...], "nextCursor": "40" } or nextCursor omitted when done.
    """
    cursor_str = request.args.get("cursor", "").strip()
    limit = request.args.get("limit", default=DEFAULT_LIMIT, type=int)
    limit = max(1, min(limit, 50))
    q = request.args.get("q", "").strip()
    author = request.args.get("author", "").strip()

    filtered = filter_books(q=q, author=author)
    start = int(cursor_str) if cursor_str and cursor_str.isdigit() else 0
    start = max(0, start)
    end = start + limit
    page = filtered[start:end]

    items = [get_book_for_list(b) for b in page]
    payload = {"items": items}
    if end < len(filtered):
        payload["nextCursor"] = str(end)
    return payload


@app.get("/books/<book_id>")
def book_detail(book_id):
    """GET /books/<id> — full detail with description, reviews, favorite."""
    book = get_book_detail(book_id)
    if book is None:
        return {"error": "Not found"}, 404
    return book


@app.post("/books/<book_id>/favorite")
def post_favorite(book_id):
    """
    POST /books/<id>/favorite — toggle favorite.
    20% random failure for optimistic rollback demo.
    Pass ?fail=true to force failure (for deterministic testing).
    Returns { "favorite": true|false }. On failure: 500.
    """
    time.sleep(API_DELAY)
    force_fail = request.args.get("fail", "").lower() == "true"
    result = toggle_favorite(book_id, force_fail=force_fail)
    if result.status == FavoriteResult.NOT_FOUND:
        return {"error": "Not found"}, 404
    if result.status == FavoriteResult.FAILURE:
        return {"error": "Favorite update failed"}, 500
    return {"favorite": result.state}


# —— Cart ——

@app.get("/cart")
def get_cart():
    """GET /cart — { items, totalItems, totalPrice }."""
    return get_cart_response()


@app.post("/cart/items")
def post_cart_items():
    """POST /cart/items — body { bookId, quantity? }. Returns updated cart."""
    time.sleep(API_DELAY)
    body = request.get_json(silent=True) or {}
    book_id = body.get("bookId") or body.get("book_id")
    quantity = body.get("quantity", 1)
    if not book_id:
        return {"error": "bookId required"}, 400
    if not add_to_cart(book_id, quantity):
        return {"error": "Book not found or invalid quantity"}, 400
    return get_cart_response()


@app.post("/cart/clear")
def post_cart_clear():
    """
    POST /cart/clear — clear cart. Returns { cart: { items, totalItems, totalPrice } }.
    ~20% random failure for optimistic rollback demo.
    Pass ?fail=true to force failure (for deterministic testing).
    """
    time.sleep(API_DELAY)
    force_fail = request.args.get("fail", "").lower() == "true"
    simulate_failure = force_fail or random.random() < 0.2
    if not clear_cart_mut(simulate_failure=simulate_failure):
        return {"error": "Clear cart failed"}, 500
    return {"cart": get_cart_response()}


@app.post("/cart/discount")
def post_cart_discount():
    """
    POST /cart/discount — body { code }. Returns discount metadata only.
    { "valid": true|false, "type": "percent"|"fixed", "value": number, "message": string }
    """
    body = request.get_json(silent=True) or {}
    code = body.get("code", "")
    return validate_discount(code)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
