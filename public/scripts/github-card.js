/**
 * GitHub 仓库卡片 Web Component（Shadow DOM 封装）
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

  const style = `
  :host { display: block; margin: 0.5rem 0; }

  a {
    display: flex; flex-direction: column; gap: 0;
    padding: 1.25rem 1.5rem;
    background: var(--md-surface-container-lowest, #fff);
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
    text-decoration: none;
    color: var(--md-on-surface-variant, #524148);
    transition: background 0.15s ease;
  }
  a:hover { background: var(--md-surface-container-high, #f3e5e8); }
  a:active { transform: scale(0.98); }

  .titlebar {
    display: flex; align-items: center; justify-content: space-between;
    color: var(--md-on-surface, #22191d);
    font-size: 1.125rem; font-weight: 600;
  }
  .titlebar-left {
    display: flex; align-items: center; gap: 0.5rem;
  }
  .owner {
    display: flex; align-items: center; gap: 0.5rem; font-weight: 400;
  }
  .avatar {
    display: inline-block; width: 1.5rem; height: 1.5rem;
    border-radius: 50%; background: var(--md-outline-variant, #d6c1c8);
    background-size: cover; vertical-align: middle;
  }
  .divider { color: var(--md-outline, #847379); font-weight: 300; }
  .repo { font-weight: 600; }
  .logo {
    display: inline-block; width: 1.5rem; height: 1.5rem;
    background: var(--md-on-surface, #22191d);
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'/%3E%3C/svg%3E") no-repeat center / contain;
  }

  .desc {
    font-size: 0.875rem; line-height: 1.5; margin: 0.5rem 0 0.75rem;
    color: var(--md-on-surface-variant, #524148);
  }

  .infobar {
    display: flex; gap: 1.25rem; font-size: 0.8rem; font-weight: 500;
    color: var(--md-on-surface-variant, #524148);
  }
  .stat { display: inline-flex; align-items: center; gap: 0.35rem; }
  .stat::before {
    content: ''; display: inline-block; width: 1rem; height: 1rem;
    background: var(--md-on-surface-variant, #524148);
    mask-size: contain; mask-repeat: no-repeat;
  }
  .stars::before { mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z'/%3E%3C/svg%3E"); }
  .forks::before { mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z'/%3E%3C/svg%3E"); }
  .license::before { mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8.75.75V2h.985c.304 0 .603.08.867.231l1.29.736c.038.022.08.033.124.033h2.234a.75.75 0 0 1 0 1.5h-.427l2.111 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.006.005-.01.01-.045.04c-.21.176-.441.327-.686.45C14.556 10.78 13.88 11 13 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L12.178 4.5h-.162c-.305 0-.604-.079-.868-.231l-1.29-.736a.245.245 0 0 0-.124-.033H8.75V13h2.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.5V3.5h-.984a.245.245 0 0 0-.124.033l-1.289.737c-.265.15-.564.23-.869.23h-.162l2.112 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.016.015-.045.04c-.21.176-.441.327-.686.45C4.556 10.78 3.88 11 3 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L2.178 4.5H1.75a.75.75 0 0 1 0-1.5h2.234a.249.249 0 0 0 .125-.033l1.288-.737c.265-.15.564-.23.869-.23h.984V.75a.75.75 0 0 1 1.5 0Zm2.945 8.477c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327Zm-10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327Z'/%3E%3C/svg%3E"); }

  /* 骨架态——视觉指示器，可点击 */
  .skeleton { opacity: 0.7; }
  .skeleton .avatar { background: var(--md-outline-variant, #d6c1c8) !important; animation: pulse 2s infinite linear; }
  .skeleton .skeleton-text {
    display: inline-block; color: transparent;
    background: var(--md-outline-variant, #d6c1c8);
    border-radius: 0.25rem; min-width: 3rem; height: 1rem;
    animation: pulse 2s infinite linear;
  }
  .skeleton .skeleton-text::before { background: transparent !important; }
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
  }

  /* 加载失败——精简为 owner/repo，可点击 */
  .fallback .infobar { display: none; }
  .fallback .avatar { display: none; }
`;

  class GithubCard extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
      const repo = this.getAttribute("repo");
      if (!repo || !repo.includes("/")) return;
      const [owner, name] = repo.split("/");

      // 先出骨架（可点击），后台拉数据
      this.renderSkeleton(owner, name);
      this.fetchRepo(repo);
    }

    repoUrl() {
      const repo = this.getAttribute("repo");
      return repo ? `https://github.com/${repo}` : "#";
    }

    renderSkeleton(owner, name) {
      const url = this.repoUrl();
      this.shadow.innerHTML = `<style>${style}</style>
      <a class="skeleton" href="${url}" target="_blank" rel="noopener noreferrer">
        <span class="titlebar">
          <span class="titlebar-left">
            <span class="owner"><span class="avatar"></span><span>${owner}</span></span>
            <span class="divider">/</span><span class="repo">${name}</span>
          </span>
          <span class="logo"></span>
        </span>
        <span class="desc skeleton-text"></span>
        <span class="infobar">
          <span class="stat skeleton-text">00K</span>
          <span class="stat skeleton-text">0K</span>
          <span class="stat skeleton-text">MIT</span>
        </span>
      </a>`;
    }

    fetchRepo(repo) {
      const cache = loadCache();
      Promise.resolve(cache).then(cached => {
        if (cached && cached[repo]) {
          this.renderCard(cached[repo]);
          return;
        }
        // 客户端 API fallback
        fetch(`https://api.github.com/repos/${repo}`, {
          headers: { Accept: "application/vnd.github.v3+json" },
        })
          .then(r => r.ok ? r.json() : Promise.reject())
          .then(d => this.renderCard(d))
          .catch(() => this.renderFallback(repo));
      });
    }

    renderFallback(repo) {
      const [owner, name] = repo.split("/");
      const url = this.repoUrl();
      this.shadow.innerHTML = `<style>${style}</style>
      <a class="skeleton" href="${url}" target="_blank" rel="noopener noreferrer">
        <span class="titlebar">
          <span class="titlebar-left">
            <span class="owner"><span class="avatar"></span><span>${owner}</span></span>
            <span class="divider">/</span><span class="repo">${name}</span>
          </span>
          <span class="logo"></span>
        </span>
        <span class="desc skeleton-text"></span>
        <span class="infobar">
          <span class="stat skeleton-text">00K</span>
          <span class="stat skeleton-text">0K</span>
          <span class="stat skeleton-text">MIT</span>
        </span>
      </a>`;
    }

    renderCard(d) {
      const owner = d.owner?.login || "";
      const avatar = d.owner?.avatar_url || "";
      const license = d.license?.spdx_id || "no-license";
      const url = d.html_url || this.repoUrl();

      this.shadow.innerHTML = `<style>${style}</style>
      <a href="${url}" target="_blank" rel="noopener noreferrer">
        <span class="titlebar">
          <span class="titlebar-left">
            <span class="owner">
              <span class="avatar" style="background-image:url(${avatar})"></span>
              <span>${owner}</span>
            </span>
            <span class="divider">/</span><span class="repo">${d.name}</span>
          </span>
          <span class="logo"></span>
        </span>
        <span class="desc">${d.description || "No description"}</span>
        <span class="infobar">
          <span class="stat stars">${fmt(d.stargazers_count || 0)}</span>
          <span class="stat forks">${fmt(d.forks_count || 0)}</span>
          <span class="stat license">${license}</span>
        </span>
      </a>`;
    }
  }

  customElements.define("github-card", GithubCard);

} // typeof HTMLElement
