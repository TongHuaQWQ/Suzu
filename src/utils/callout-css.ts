/**
 * 构建时：从 rehype-callouts 主题复制 CSS，注入 SVG 图标，写入 callout.css。
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function generateCalloutCSS(theme: string) {
  const THEME_CSS = resolve(
    __dirname,
    "../../node_modules/rehype-callouts/dist/themes",
    theme,
    "index.css",
  );

  if (!existsSync(THEME_CSS)) return;

  let css = readFileSync(THEME_CSS, "utf-8");

  // [data-callout='xxx'] → .callout-xxx
  css = css.replace(/\[data-callout='([^']+)'\]/g, ".callout-$1");

  // 简化 CSS：移除不需要的规则
  css = css.replace(/--rc-color-default:\s*#[0-9a-f]+;?\s*/g, "");
  css = css.replace(/mix-blend-mode:[\s\w-]+;?\s*/g, "");
  css = css.replace(
    /background-color:\s*rgb\(from\s+var\(--rc-color-light[^)]*\)\s*r\s*g\s*b\s*\/\s*[\d.]+\)/g,
    "background-color: color-mix(in srgb, var(--rc-color-light) 12%, transparent)",
  );
  css = css.replace(
    /background-color:\s*rgb\(from\s+var\(--rc-color-dark[^)]*\)\s*r\s*g\s*b\s*\/\s*[\d.]+\)/g,
    "background-color: color-mix(in srgb, var(--rc-color-dark) 12%, transparent)",
  );
  css = css.replace(
    /color:\s*var\(--rc-color-light,\s*var\(--rc-color-default\)\)/g,
    "color: var(--rc-color-light)",
  );
  css = css.replace(
    /color:\s*var\(--rc-color-dark,\s*var\(--rc-color-default\)\)/g,
    "color: var(--rc-color-dark)",
  );

  // 追加 SVG 图标（mask-image，不覆盖主题布局）
  const { getCalloutIcons } = await import("../plugins/theme-icons.ts");
  const icons: Record<string, { title: string; icon: string }> =
    getCalloutIcons(theme);
  let svgCSS = "";
  for (const [key, val] of Object.entries(icons)) {
    if (!val.icon) continue;
    const raw = val.icon
      .replace(/currentColor/gi, "black")
      .replace(/\s+/g, " ")
      .trim();
    const b64 = Buffer.from(raw, "utf-8").toString("base64");
    svgCSS +=
      `.callout-${key} .callout-title::before{content:"";display:inline-block;` +
      `width:1em;height:1em;background-color:currentColor;` +
      `mask-image:url("data:image/svg+xml;base64,${b64}");mask-size:contain;mask-repeat:no-repeat;` +
      `flex-shrink:0;align-self:center;` +
      `-webkit-mask-image:url("data:image/svg+xml;base64,${b64}");` +
      `-webkit-mask-size:contain;-webkit-mask-repeat:no-repeat}\n`;
  }
  css += "\n" + svgCSS;

  // 追加折叠 callout 支持（<details>）
  css += `
/* ── Collapsible callout (from remark-callout plugin) ── */
.callout[open] .callout-title {
  margin-bottom: 0.5rem;
}
summary.callout-title {
  list-style:none;
}
details.callout summary.callout-title::-webkit-details-marker,
details.callout summary.callout-title::marker {
  display: none !important;
}
/* 覆盖 Tailwind prose 对 blockquote 的默认左边框 */
blockquote.callout {
  --tw-prose-quote-borders: transparent !important;
}
details.callout .callout-title::after {
  content:"";
  display:inline-block;
  width:1em;
  height:1em;
  margin-left:.05em;
  background-color:currentColor;
  mask-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNNC41MjcgNC4zNWEuNzUuNzUgMCAwIDEgMS4wNiAwTDggNi40NjhsMi40MTMtMi4xMThhLjc1Ljc1IDAgMSAxIC45NzQgMS4xNkw4LjQ4NyA4LjA1YS43NS43NSAwIDAgMS0uOTc0IDBMMy41NTMgNS41MWEuNzUuNzUgMCAwIDEgMC0xLjE2eiIvPjwvc3ZnPg==");
  mask-size:contain;
  mask-repeat:no-repeat;
  transition:transform .2s;
  flex-shrink:0;
}
details.callout:not([open]) .callout-title::after {
  transform:rotate(-90deg);
}
`;

  writeFileSync(resolve(__dirname, "../styles/callout.css"), css, "utf-8");
}
