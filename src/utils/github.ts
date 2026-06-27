import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * GitHub API 工具函数
 * 构建时获取仓库数据，带内存缓存避免重复请求
 */

const cache = new Map<string, any>();

// 构建时自动读取 .env（Vite 在 astro.config.mjs 阶段还没加载 .env）
function getGithubToken(): string {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const envPath = join(process.cwd(), '.env');
    if (!existsSync(envPath)) return '';
    const content = readFileSync(envPath, 'utf-8');
    const match = content.match(/^GITHUB_TOKEN=(.+)$/m);
    return match ? match[1].trim() : '';
  } catch {
    return '';
  }
}

export async function fetchRepo(repo: string): Promise<any> {
  if (cache.has(repo)) return cache.get(repo);

  const token = getGithubToken();
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json();
    cache.set(repo, data);
    return data;
  } catch (e) {
    cache.set(repo, null);
    return null;
  }
}

/** 扫描 content 目录，提取所有 ::github{repo="..."} 仓库名 */
function scanGitHubRepos(): string[] {
  function scanFiles(dir: string): string[] {
    const files: string[] = [];
    try {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) files.push(...scanFiles(full));
        else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) files.push(full);
      }
    } catch {}
    return files;
  }

  const contentDir = join(process.cwd(), 'src', 'content');
  const mdFiles = scanFiles(contentDir);
  const repoSet = new Set<string>();

  for (const file of mdFiles) {
    const content = readFileSync(file, 'utf-8');
    const regex = /::github\s*\{[^}]*repo\s*=\s*"([^"]+)"/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      repoSet.add(match[1]);
    }
  }

  return [...repoSet];
}

/** 构建时预取所有 GitHub 仓库数据，写入 public/github-cache.json */
export async function generateGitHubCache(): Promise<void> {
  const repos = scanGitHubRepos();
  if (repos.length === 0) return;

  const data: Record<string, any> = {};
  for (const repo of repos) {
    data[repo] = await fetchRepo(repo);
  }

  const outPath = join(process.cwd(), 'public', 'github-cache.json');
  writeFileSync(outPath, JSON.stringify(data), 'utf-8');
  console.log(`[github] Cached ${Object.keys(data).length} repos to public/github-cache.json`);
}
