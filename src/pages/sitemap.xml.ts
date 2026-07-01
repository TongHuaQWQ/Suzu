import { site } from "../site.config";

export function GET() {
  const baseUrl = site.url.replace(/\/$/, "");
  const sitemapUrl = `${baseUrl}/sitemap-index.xml`;

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${sitemapUrl}</loc>
  </sitemap>
</sitemapindex>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    },
  );
}
