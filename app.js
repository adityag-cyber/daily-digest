/* ════════════════════════════════════════════
   Aditya's Daily Digest — Frontend Logic
   ════════════════════════════════════════════ */

const CATEGORY_ORDER = [
  "geopolitics",
  "finance",
  "startups_india",
  "tech_global",
  "ai_fun",
  "indian_politics",
  "andhra_politics",
  "sports",
];

// Fallback demo data shown when no news.json exists yet
const DEMO_DATA = {
  date: new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
  generated_at: new Date().toISOString(),
  categories: {
    geopolitics: {
      name: "Geopolitics", icon: "🌍", color: "#4facfe",
      articles: [
        { title: "G7 Summit: Leaders Meet on Trade", simple: "The leaders of the 7 richest countries sat together to talk about how they can trade goods more fairly without hurting each other's economies. Think of it like neighbouring shop owners agreeing on prices so no one sells too cheap.", link: "#", published: "" },
        { title: "UN Climate Talks Stall Again", simple: "Countries couldn't agree on who should cut pollution faster — rich countries want developing ones to do more, while poorer nations say the rich caused most of the problem in the first place.", link: "#", published: "" },
        { title: "Middle East Ceasefire Talks Resume", simple: "Countries from the region are sitting down again to try and stop the ongoing conflict. A ceasefire means both sides agree to stop fighting — at least for a while.", link: "#", published: "" },
      ]
    },
    finance: {
      name: "SENSEX & Finance", icon: "📈", color: "#43e97b",
      articles: [
        { title: "SENSEX Rises 400 Points", simple: "SENSEX is like a score that shows how the top 30 big Indian companies are doing in the stock market today. It went up by 400 — meaning more people are buying shares (betting that companies will do well). Good mood in the market!", link: "#", published: "" },
        { title: "RBI Holds Interest Rates Steady", simple: "RBI (India's central bank) decided not to change the interest rate — the rate at which banks borrow money. This means your home loan EMI stays the same for now.", link: "#", published: "" },
        { title: "Rupee Strengthens Against Dollar", simple: "₹1 can now buy slightly more dollars than yesterday. This is good if you buy things from abroad (cheaper imports), but slightly bad for IT companies that earn in dollars.", link: "#", published: "" },
      ]
    },
    startups_india: {
      name: "Startups & Tech India", icon: "🚀", color: "#fa709a",
      articles: [
        { title: "Zepto Raises $350M in New Funding", simple: "Zepto, the 10-minute grocery delivery app, just got ₹2,900 crore from investors. That's a LOT of money — it means investors believe quick-commerce in India is going to get even bigger.", link: "#", published: "" },
        { title: "PhonePe Expands to Insurance", simple: "PhonePe, the UPI payments app you use every day, is now also selling insurance. They're betting that people who already trust them for payments will buy health & vehicle insurance through the same app.", link: "#", published: "" },
        { title: "India's AI Startup Scene Heats Up", simple: "Several Indian startups building AI tools just got funded this week — from AI for agriculture to AI for customer service in regional languages. India is becoming a serious player in AI.", link: "#", published: "" },
      ]
    },
    tech_global: {
      name: "Tech Global", icon: "💻", color: "#a18cd1",
      articles: [
        { title: "Apple Announces New AI Features for iPhone", simple: "Apple is adding smarter AI to iPhones — things like auto-summarising your messages and a smarter Siri. They're playing catch-up with Google and Samsung who already have similar features.", link: "#", published: "" },
        { title: "Meta Launches New VR Headset", simple: "Meta (Facebook's company) released a new virtual reality headset that lets you feel like you're inside a video game or movie. They're trying to make it more affordable so more people buy it.", link: "#", published: "" },
        { title: "SpaceX Starship Completes Successful Test", simple: "Elon Musk's giant rocket — Starship — finished another test flight successfully. The goal is to use it to send humans to the Moon and eventually Mars. It's the biggest rocket ever built.", link: "#", published: "" },
      ]
    },
    ai_fun: {
      name: "AI & Fun News", icon: "🤖", color: "#f093fb",
      articles: [
        { title: "Claude AI Gets Smarter with New Update", simple: "Anthropic upgraded Claude (that's me!) — now better at reasoning through hard problems, writing code, and understanding long documents. AI assistants are getting genuinely useful fast.", link: "#", published: "" },
        { title: "AI Beats World Champion at Chess... Again", simple: "An AI system crushed the world chess champion — again! This isn't surprising anymore (AI has been beating humans at chess since 1997), but this one did it in new creative ways that surprised everyone.", link: "#", published: "" },
        { title: "Scientists Use AI to Discover New Antibiotics", simple: "AI analysed millions of chemical compounds and found a new type of antibiotic that can fight bacteria that are resistant to current drugs. This could save millions of lives over time — genuinely huge news!", link: "#", published: "" },
      ]
    },
    indian_politics: {
      name: "Indian Politics", icon: "🇮🇳", color: "#ff9a9e",
      articles: [
        { title: "Parliament Session: New Bills Introduced", simple: "Parliament is in session and several new laws were introduced today. One of them deals with data privacy — how companies must protect your personal information online.", link: "#", published: "" },
        { title: "Opposition Holds Protest in Delhi", simple: "Several opposition parties gathered in Delhi to protest a government decision. Protests like this are a normal part of democracy — the opposition's way of publicly disagreeing with the ruling government.", link: "#", published: "" },
        { title: "PM Modi Visits Three States", simple: "The Prime Minister is on a visit to three states — these trips usually involve inaugurating projects (roads, hospitals, etc.) or meeting local party leaders. Often happens before or after elections in those states.", link: "#", published: "" },
      ]
    },
    andhra_politics: {
      name: "Andhra Pradesh Politics", icon: "🏛️", color: "#f77062",
      articles: [
        { title: "CM Chandrababu Naidu Reviews Amaravati Progress", simple: "Andhra Pradesh's Chief Minister reviewed how fast the new capital city Amaravati is being built. Construction is picking up pace and the government wants to shift some offices there by next year.", link: "#", published: "" },
        { title: "Polavaram Project Gets Funding Push", simple: "The Polavaram dam project — which will bring drinking water and electricity to many villages in AP — got fresh funds from the central government. It's been delayed for years; this is a positive step.", link: "#", published: "" },
        { title: "AP Budget Focuses on Education", simple: "The state government announced extra money for building better schools and paying teachers more. This is part of the promise to improve primary education quality across Andhra Pradesh.", link: "#", published: "" },
      ]
    },
    sports: {
      name: "Sports", icon: "🏆", color: "#4481eb",
      articles: [
        { title: "India vs England Test: Kohli Scores Century", simple: "Virat Kohli hit 100 runs in the Test match today — his first century in a while! India is in a strong position and looking to win the match. The crowd went absolutely wild. 🎉", link: "#", published: "" },
        { title: "Champions League: Real Madrid Through to Final", simple: "Real Madrid beat their opponents and are now in the Champions League final (football's biggest club trophy). They'll face Manchester City — should be an epic match!", link: "#", published: "" },
        { title: "Neeraj Chopra Wins Gold at Diamond League", simple: "Neeraj Chopra — India's javelin superstar — threw the javelin over 88 metres to win gold at a top international athletics event. India's pride on the world stage! 🇮🇳🥇", link: "#", published: "" },
      ]
    },
  }
};

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  setDateLine();
  loadNews();
});

function setDateLine() {
  const el = document.getElementById("date-line");
  if (el) {
    el.textContent = new Date().toLocaleDateString("en-IN", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  }
}

// ─────────────────────────────────────────
// LOAD NEWS
// ─────────────────────────────────────────

async function loadNews() {
  showLoading();

  try {
    // Try fetching the generated JSON file
    const res = await fetch(`data/news.json?t=${Date.now()}`);
    if (!res.ok) throw new Error("not found");
    const data = await res.json();
    renderNews(data);
  } catch (_) {
    // Show demo data with a notice
    renderNews(DEMO_DATA, true);
  }
}

function showLoading() {
  document.getElementById("loading-state").classList.remove("hidden");
  document.getElementById("error-state").classList.add("hidden");
  document.getElementById("news-grid").classList.add("hidden");
}

// ─────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────

function renderNews(data, isDemo = false) {
  document.getElementById("loading-state").classList.add("hidden");
  document.getElementById("error-state").classList.add("hidden");

  const grid = document.getElementById("news-grid");
  const nav = document.getElementById("cat-nav");
  const lastUpdated = document.getElementById("last-updated");

  // Last updated
  if (isDemo) {
    lastUpdated.innerHTML = `<span style="color:#f093fb">✦ Demo mode</span><br>Run fetcher to get live news`;
  } else {
    const d = new Date(data.generated_at);
    lastUpdated.innerHTML = `Updated<br>${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
  }

  // Build nav pills
  nav.innerHTML = "";
  CATEGORY_ORDER.forEach((key) => {
    const cat = data.categories[key];
    if (!cat) return;
    const pill = document.createElement("a");
    pill.className = "cat-pill";
    pill.href = `#cat-${key}`;
    pill.style.setProperty("--cat-color", cat.color);
    pill.innerHTML = `${cat.icon} ${cat.name}`;
    nav.appendChild(pill);
  });

  // Build grid
  grid.innerHTML = "";
  CATEGORY_ORDER.forEach((key) => {
    const cat = data.categories[key];
    if (!cat || !cat.articles) return;
    grid.appendChild(buildCard(key, cat));
  });

  grid.classList.remove("hidden");
}

function buildCard(key, cat) {
  const card = document.createElement("div");
  card.className = "cat-card";
  card.id = `cat-${key}`;
  card.style.setProperty("--cat-color", cat.color);

  const articles = cat.articles || [];

  card.innerHTML = `
    <div class="cat-card-header">
      <span class="cat-icon">${cat.icon}</span>
      <span class="cat-title">${cat.name}</span>
      <span class="cat-count">${articles.length} stories</span>
    </div>
    <ul class="articles-list">
      ${articles.length === 0
        ? `<li class="article-item"><span class="article-simplified" style="color:var(--text-muted)">No articles available. Run the fetcher to get news.</span></li>`
        : articles.map(a => buildArticleItem(a)).join("")
      }
    </ul>
  `;

  return card;
}

function buildArticleItem(article) {
  const linkHtml = article.link && article.link !== "#"
    ? `<a class="article-link" href="${escHtml(article.link)}" target="_blank" rel="noopener">Read →</a>`
    : "";

  return `
    <li class="article-item">
      <p class="article-simplified">${escHtml(article.simple || article.title)}</p>
      <div class="article-meta">
        <span class="article-original-title" title="${escHtml(article.title)}">${escHtml(article.title)}</span>
        ${linkHtml}
      </div>
    </li>
  `;
}

function escHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
