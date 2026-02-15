"""
Seed backend/data/books.json with 100+ books (assignment: "at least 100 books, can be generated/seeded").

Run from backend/:  python scripts/seed_books.py

This OVERWRITES data/books.json. To keep your custom book list, back it up first or do not run.
Use --count to set how many books (default 100).
"""
import argparse
import json
import random
from pathlib import Path

BACKEND = Path(__file__).resolve().parent.parent
OUT_FILE = BACKEND / "data" / "books.json"

# Romantasy / fantasy romance titles and authors
TITLES = [
    "Throne of Glass", "Crown of Midnight", "Heir of Fire", "Queen of Shadows",
    "Empire of Storms", "Tower of Dawn", "Kingdom of Ash",
    "A Court of Thorns and Roses", "A Court of Mist and Fury", "A Court of Wings and Ruin",
    "A Court of Frost and Starlight", "A Court of Silver Flames",
    "House of Earth and Blood", "House of Sky and Breath", "House of Flame and Shadow",
    "Fourth Wing", "Iron Flame", "Onyx Storm",
    "The Bridge Kingdom", "The Traitor Queen", "The Dark Shores",
    "From Blood and Ash", "A Kingdom of Flesh and Fire", "The Crown of Gilded Bones",
    "The War of Two Queens",
    "Kingdom of the Wicked", "Kingdom of the Cursed", "Kingdom of the Feared",
    "The Serpent and the Wings of Night", "The Ashes and the Star-Cursed King", "Six Scorched Roses",
    "The Priory of the Orange Tree", "The Oleander Sword",
    "An Ember in the Ashes", "A Torch Against the Night", "A Reaper at the Gates", "A Sky Beyond the Storm",
    "The Cruel Prince", "The Wicked King", "The Queen of Nothing", "The Book of Night",
    "Shadow and Bone", "Siege and Storm", "Ruin and Rising", "Six of Crows", "Crooked Kingdom",
    "Ninth House", "Hell Bent",
    "A Darker Shade of Magic", "A Gathering of Shadows", "A Conjuring of Light",
    "The Invisible Life of Addie LaRue",
    "Uprooted", "Spinning Silver",
    "The Night Circus", "The Starless Sea",
    "Red Queen", "Glass Sword", "King's Cage", "War Storm",
    "A Deal with the Elf King", "A Dance with the Fae Prince", "A Kiss with the Fae King",
    "The Shadows Between Us", "The Prison Healer", "The Gilded Cage", "The Blood Traitor",
    "Defy the Night", "Defend the Dawn",
    "A Curse So Dark and Lonely", "A Heart So Fierce and Broken", "A Vow So Bold and Deadly",
    "To Kill a Kingdom", "The Kinder Poison", "The Cruelest Mercy",
    "We Hunt the Flame", "We Free the Stars",
    "The City of Brass", "The Kingdom of Copper", "The Empire of Gold",
    "The Poppy War", "The Dragon Republic", "The Burning God", "Babel", "Yellowface",
    "The Bear and the Nightingale", "The Girl in the Tower", "The Winter of the Witch",
    "Sorcery of Thorns", "The Bone Shard Daughter", "The Bone Shard Emperor", "The Bone Shard War",
    "The Jasmine Throne", "The Once and Future Witches",
    "The Beautiful", "The Damned", "Daughter of the Moon Goddess", "Heart of the Sun Warrior",
    "The Atlas Six", "The Atlas Paradox", "The Atlas Complex",
    "One Dark Window", "Two Twisted Crowns",
    "Divine Rivals", "Ruthless Vows", "A River Enchanted", "A Fire Endless",
    "The Very Secret Society of Irregular Witches", "The Dawn of Onyx",
]

AUTHORS = [
    "Sarah J. Maas", "Rebecca Yarros", "Danielle L. Jensen", "Jennifer L. Armentrout",
    "Kerri Maniscalco", "Carissa Broadbent", "Samantha Shannon", "Sabaa Tahir",
    "Holly Black", "Leigh Bardugo", "V.E. Schwab", "Naomi Novik", "Erin Morgenstern",
    "Victoria Aveyard", "Elise Kova", "Tricia Levenseller", "Lynette Noni",
    "Brigid Kemmerer", "Alexandra Christo", "Natalie Mae", "Hafsah Faizal",
    "S.A. Chakraborty", "R.F. Kuang", "Katherine Arden", "Margaret Rogerson",
    "Gita Trelease", "Renée Ahdieh", "Sue Lynn Tan", "Andrea Stewart", "Tasha Suri",
    "Alix E. Harrow", "Olivie Blake", "Rachel Gillig", "Rebecca Ross", "Sangu Mandanna",
    "Kate Golden",
]

DESCRIPTIONS = [
    "A sweeping tale of magic, romance, and impossible choices.",
    "Dark secrets and forbidden love in a world of fae and mortals.",
    "Power, betrayal, and a love that could save or destroy everything.",
    "An epic fantasy with dragons, courts, and heart-stopping romance.",
    "Where loyalty is tested and destiny cannot be denied.",
]


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed data/books.json with generated books.")
    parser.add_argument("--count", type=int, default=100, help="Number of books to generate (default 100)")
    args = parser.parse_args()
    count = max(100, args.count)

    random.seed(42)
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    books = []
    for i in range(1, count + 1):
        title = random.choice(TITLES)
        author = random.choice(AUTHORS)
        books.append({
            "id": str(i),
            "title": title,
            "author": author,
            "price": round(random.uniform(12.99, 24.99), 2),
            "stock": random.randint(5, 80),
            "description": random.choice(DESCRIPTIONS),
            "reviews": [],
        })

    OUT_FILE.write_text(json.dumps(books, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(books)} books to {OUT_FILE}")


if __name__ == "__main__":
    main()
