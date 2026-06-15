"""
Daily Digest News Fetcher
Fetches top news from RSS feeds and simplifies them using Claude AI.
Run this script daily to update your news dashboard.
"""

import feedparser
import anthropic
import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path

# ─────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

CATEGORIES = {
    "geopolitics": {
        "name": "Geopolitics",
        "icon": "🌍",
        "color": "#4facfe",
        "feeds": [
            "https://feeds.bbci.co.uk/news/world/rss.xml",
            "https://www.aljazeera.com/xml/rss/all.xml",
            "https://feeds.reuters.com/reuters/worldNews",
        ],
        "simplify_prompt": (
            "You're explaining world news to a curious 16-year-old in India. "
            "Use very simple language. No jargon. Replace big words with easy ones. "
            "Add a tiny bit of context so they understand WHY it matters. "
            "2-3 sentences max."
        ),
    },
    "finance": {
        "name": "SENSEX & Finance",
        "icon": "📈",
        "color": "#43e97b",
        "feeds": [
            "https://economictimes.indiatimes.com/markets/rss.cms",
            "https://www.moneycontrol.com/rss/business.xml",
            "https://economictimes.indiatimes.com/rssfeedstopstories.cms",
        ],
        "simplify_prompt": (
            "Explain this finance/market news in the simplest possible way — "
            "as if the reader has never studied finance. Avoid all stock market jargon. "
            "If you must use a term like SENSEX or inflation, explain it in brackets. "
            "Tell them what it means for their daily life. 2-3 sentences max."
        ),
    },
    "startups_india": {
        "name": "Startups & Tech India",
        "icon": "🚀",
        "color": "#fa709a",
        "feeds": [
            "https://yourstory.com/feed",
            "https://inc42.com/feed/",
            "https://entrackr.com/feed/",
        ],
        "simplify_prompt": (
            "Summarise this Indian startup/tech news simply for a general audience. "
            "If a company raised money, explain what they do and why investors care. "
            "Keep it exciting and easy. 2-3 sentences."
        ),
    },
    "tech_global": {
        "name": "Tech Global",
        "icon": "💻",
        "color": "#a18cd1",
        "feeds": [
            "https://techcrunch.com/feed/",
            "https://www.theverge.com/rss/index.xml",
            "https://www.wired.com/feed/rss",
        ],
        "simplify_prompt": (
            "Explain this global tech news to someone who uses a smartphone but doesn't "
            "know programming or tech deeply. Be clear and interesting. "
            "Mention why it matters to regular people. 2-3 sentences."
        ),
    },
    "ai_fun": {
        "name": "AI & Fun News",
        "icon": "🤖",
        "color": "#f093fb",
        "feeds": [
            "https://venturebeat.com/ai/feed/",
            "https://www.technologyreview.com/feed/",
            "https://feeds.bbci.co.uk/news/technology/rss.xml",
        ],
        "simplify_prompt": (
            "Explain this AI/technology news in a fun, engaging way for someone curious "
            "about AI but not technical. Be enthusiastic and clear. If it's a fun/quirky "
            "story, match that energy. 2-3 sentences."
        ),
    },
    "indian_politics": {
        "name": "Indian Politics",
        "icon": "🇮🇳",
        "color": "#ff9a9e",
        "feeds": [
            "https://feeds.feedburner.com/ndtvnews-india-news",
            "https://www.thehindu.com/news/national/feeder/default.rss",
            "https://indianexpress.com/section/india/feed/",
        ],
        "simplify_prompt": (
            "Explain this Indian politics news very simply — who did what and why it matters "
            "for common citizens. Avoid political bias. Be factual and neutral. "
            "If there's a policy, explain its real-world impact. 2-3 sentences."
        ),
    },
    "andhra_politics": {
        "name": "Andhra Pradesh Politics",
        "icon": "🏛️",
        "color": "#f77062",
        "feeds": [
            "https://www.thehindu.com/news/national/andhra-pradesh/feeder/default.rss",
            "https://www.deccanchronicle.com/rss_feed/?id=10",
            "https://timesofindia.indiatimes.com/rssfeeds/913168846.cms",
        ],
        "simplify_prompt": (
            "Explain this Andhra Pradesh political news clearly and simply. "
            "Focus on what it means for people living in Andhra. Be neutral and factual. "
            "Name the key people involved briefly. 2-3 sentences."
        ),
    },
    "sports": {
        "name": "Sports",
        "icon": "🏆",
        "color": "#4481eb",
        "feeds": [
            "https://www.espncricinfo.com/rss/content/story/feeds/0.xml",
            "https://feeds.bbci.co.uk/sport/football/rss.xml",
            "https://feeds.bbci.co.uk/sport/athletics/rss.xml",
        ],
        "simplify_prompt": (
            "Give a quick, exciting sports update. Be like a friend texting you the score. "
            "For cricket, mention key players and the match result/situation. "
            "For football, same thing. Keep it punchy and fun. 2-3 sentences."
        ),
    },
}

ARTICLES_PER_CATEGORY = 5
DATA_FILE = Path(__file__).parent / "data" / "news.json"


# ─────────────────────────────────────────
# FETCH RSS FEEDS
# ─────────────────────────────────────────

def fetch_articles(feeds: list[str], limit: int = 10) -> list[dict]:
    articles = []
    seen_titles = set()

    for url in feeds:
        try:
            print(f"  Fetching: {url}")
            feed = feedparser.parse(url)
            for entry in feed.entries:
                title = entry.get("title", "").strip()
                if not title or title in seen_titles:
                    continue
                seen_titles.add(title)
                summary = entry.get("summary", entry.get("description", ""))
                # Strip HTML tags roughly
                import re
                summary = re.sub(r"<[^>]+>", "", summary).strip()
                articles.append({
                    "title": title,
                    "summary": summary[:500],
                    "link": entry.get("link", ""),
                    "published": entry.get("published", ""),
                })
        except Exception as e:
            print(f"  ⚠ Failed to fetch {url}: {e}")

    return articles[:limit]


# ─────────────────────────────────────────
# SIMPLIFY WITH CLAUDE
# ─────────────────────────────────────────

def simplify_article(client: anthropic.Anthropic, article: dict, prompt: str) -> str:
    content = f"Headline: {article['title']}\nDetails: {article['summary']}"
    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=200,
            messages=[
                {
                    "role": "user",
                    "content": f"{prompt}\n\nNews:\n{content}",
                }
            ],
        )
        return response.content[0].text.strip()
    except Exception as e:
        print(f"  ⚠ Claude error: {e}")
        return article["summary"][:200] + "..."


# ─────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────

def main():
    if not ANTHROPIC_API_KEY:
        print("❌ Set your ANTHROPIC_API_KEY environment variable first.")
        print("   Run: $env:ANTHROPIC_API_KEY = 'sk-ant-...'")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    print(f"\n{'='*50}")
    print(f"  Daily Digest Fetcher — {datetime.now().strftime('%B %d, %Y %I:%M %p')}")
    print(f"{'='*50}\n")

    output = {
        "generated_at": datetime.now().isoformat(),
        "date": datetime.now().strftime("%A, %B %d %Y"),
        "categories": {},
    }

    for key, cat in CATEGORIES.items():
        print(f"\n{cat['icon']} {cat['name']}")
        print(f"  Fetching articles...")

        articles = fetch_articles(cat["feeds"], limit=ARTICLES_PER_CATEGORY + 5)

        if not articles:
            print(f"  ⚠ No articles found.")
            output["categories"][key] = {
                "name": cat["name"],
                "icon": cat["icon"],
                "color": cat["color"],
                "articles": [],
            }
            continue

        processed = []
        for i, article in enumerate(articles[:ARTICLES_PER_CATEGORY]):
            print(f"  Simplifying [{i+1}/{ARTICLES_PER_CATEGORY}]: {article['title'][:60]}...")
            simple = simplify_article(client, article, cat["simplify_prompt"])
            processed.append({
                "title": article["title"],
                "simple": simple,
                "link": article["link"],
                "published": article["published"],
            })
            time.sleep(0.3)  # be gentle with the API

        output["categories"][key] = {
            "name": cat["name"],
            "icon": cat["icon"],
            "color": cat["color"],
            "articles": processed,
        }
        print(f"  ✓ Done — {len(processed)} articles")

    DATA_FILE.parent.mkdir(exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Saved to {DATA_FILE}")
    print(f"   Open index.html in your browser to read your digest!\n")


if __name__ == "__main__":
    main()
