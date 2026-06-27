/**
 * GitHub 仓库卡片 Web Component（Fuwari 风格）
 * 优先读取构建时生成的 github-cache.json
 * 缓存中无数据时回退到客户端 API 请求
 */

if (typeof HTMLElement !== 'undefined') {

let cacheData = null;

async function loadCache() {
  if (cacheData) return cacheData;
  try {
    const res = await fetch('/github-cache.json');
    if (!res.ok) throw new Error('No cache');
    cacheData = await res.json();
  } catch {
    cacheData = {};
  }
  return cacheData;
}

function fmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n);
}

class GithubCard extends HTMLElement {
  async connectedCallback() {
    const repo = this.getAttribute("repo");
    if (!repo || !repo.includes("/")) return;
    const [owner, name] = repo.split("/");

    // 优先读取构建缓存
    const cache = await loadCache();
    const data = cache[repo];

    if (data) {
      this.renderCard(data);
    } else if (cache[repo] === null) {
      // 缓存明确为 null —— 构建时没取到数据，走客户端备用
      this.renderPlaceholder(owner, name);
      this.fetchRepo(repo);
    } else {
      // 缓存里根本没有这个 repo（用户可能是新增的），走客户端
      this.renderPlaceholder(owner, name);
      this.fetchRepo(repo);
    }
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
    fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => this.renderCard(d))
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
          <span class="gc-stars">${fmt(d.stargazers_count || 0)}</span>
          <span class="gc-forks">${fmt(d.forks_count || 0)}</span>
          <span class="gc-license">${license}</span>
        </div>
      </a>`;
  }
}

if (!customElements.get("github-card")) {
  customElements.define("github-card", GithubCard);
}

} // typeof HTMLElement
