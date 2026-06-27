/**
 * GitHub 仓库卡片 Web Component（Fuwari 风格）
 * 带 localStorage 缓存（1 小时）
 */

if (typeof HTMLElement !== 'undefined') {

const CACHE_KEY = "github-repo-cache";
const CACHE_TTL = 3600000;

function getCache(repo) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    const entry = cache[repo];
    if (entry && Date.now() - entry.time < CACHE_TTL) return entry.data;
  } catch (e) {}
  return null;
}

function setCache(repo, data) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    cache[repo] = { data, time: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {}
}

function fmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n);
}

class GithubCard extends HTMLElement {
  connectedCallback() {
    const repo = this.getAttribute("repo");
    if (!repo || !repo.includes("/")) return;
    const [owner, name] = repo.split("/");
    this.renderPlaceholder(owner, name);
    const cached = getCache(repo);
    if (cached) { this.renderCard(cached); return; }
    this.fetchRepo(repo);
  }

  renderPlaceholder(owner, name) {
    this.innerHTML = `
      <a class="gc-card gc-waiting" href="https://github.com/${owner}/${name}" target="_blank" rel="noopener noreferrer">
        <div class="gc-titlebar">
          <div class="gc-titlebar-left">
            <div class="gc-owner"><div class="gc-avatar"></div><span>${owner}</span></div>
            <span class="gc-divider">/</span>
            <div class="gc-repo">${name}</div>
          </div>
          <div class="gc-github-logo"></div>
        </div>
        <div class="gc-desc gc-skeleton">Loading...</div>
        <div class="gc-infobar">
          <span class="gc-stars gc-skeleton">00K</span>
          <span class="gc-forks gc-skeleton">0K</span>
          <span class="gc-license gc-skeleton">MIT</span>
        </div>
      </a>`;
  }

  fetchRepo(repo) {
    const TOKEN = document.body.dataset.githubToken || "";
    const headers = { Accept: "application/vnd.github.v3+json" };
    if (TOKEN) headers.Authorization = "Bearer " + TOKEN;

    fetch("https://api.github.com/repos/" + repo, { headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setCache(repo, d); this.renderCard(d); })
      .catch(() => { this.classList.add("gc-error"); });
  }

  renderCard(d) {
    const owner = d.owner?.login || "";
    const avatar = d.owner?.avatar_url || "";
    const license = d.license?.spdx_id || "no-license";

    this.innerHTML = `
      <a class="gc-card" href="${d.html_url}" target="_blank" rel="noopener noreferrer">
        <div class="gc-titlebar">
          <div class="gc-titlebar-left">
            <div class="gc-owner">
              <div class="gc-avatar" style="background-image:url(${avatar});background-color:transparent"></div>
              <span>${owner}</span>
            </div>
            <span class="gc-divider">/</span>
            <div class="gc-repo">${d.name}</div>
          </div>
          <div class="gc-github-logo"></div>
        </div>
        <div class="gc-desc">${d.description || "No description"}</div>
        <div class="gc-infobar">
          <span class="gc-stars">${fmt(d.stargazers_count)}</span>
          <span class="gc-forks">${fmt(d.forks_count)}</span>
          <span class="gc-license">${license}</span>
        </div>
      </a>`;
  }
}

if (!customElements.get("github-card")) {
  customElements.define("github-card", GithubCard);
}

} // typeof HTMLElement
