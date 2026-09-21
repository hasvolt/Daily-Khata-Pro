import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CANONICAL_DOMAIN = 'https://www.rozfiber.com';
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

async function generateSitemap() {
  console.log('[sitemap] Starting build-time sitemap update...');

  if (!fs.existsSync(SITEMAP_PATH)) {
    console.warn('[sitemap] public/sitemap.xml not found, skipping.');
    return;
  }

  let xml = fs.readFileSync(SITEMAP_PATH, 'utf8');

  // 1. Standardize all existing URLs to https://www.rozfiber.com
  xml = xml.replace(/https:\/\/rozfiber\.com/g, CANONICAL_DOMAIN);

  // 2. Ensure https://www.rozfiber.com/blog is in the sitemap
  const blogUrl = `${CANONICAL_DOMAIN}/blog`;
  const newUrls = [];
  if (!xml.includes(`<loc>${blogUrl}</loc>`)) {
    const today = new Date().toISOString().split('T')[0];
    newUrls.push(`  <url>\n    <loc>${blogUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`);
  }

  // 3. Query published Sanity posts with valid slugs using native fetch
  let posts = [];
  try {
    const query = encodeURIComponent('*[_type == "post" && defined(slug.current)] { "slug": slug.current, _updatedAt, publishedAt }');
    const apiUrl = `https://3zccyf67.api.sanity.io/v2024-01-01/data/query/production?query=${query}`;
    const res = await fetch(apiUrl);
    if (res.ok) {
      const data = await res.json();
      posts = data.result || [];
    }
    console.log(`[sitemap] Retrieved ${posts.length} published post(s) from Sanity.`);

    // Add each published Sanity post
    for (const post of posts) {
      if (!post.slug) continue;
      const articleUrl = `${CANONICAL_DOMAIN}/blog/${encodeURIComponent(post.slug)}`;
      if (!xml.includes(`<loc>${articleUrl}</loc>`)) {
        const lastmod = post._updatedAt ? post._updatedAt.split('T')[0] : (post.publishedAt ? post.publishedAt.split('T')[0] : '');
        const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
        newUrls.push(`  <url>\n    <loc>${articleUrl}</loc>${lastmodTag}\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
      }
    }
  } catch (err) {
    console.warn('[sitemap] Notice: Could not query Sanity posts (saving standardized base sitemap):', err.message);
  }

  // 4. Inject before </urlset> if there are new URLs to add
  if (newUrls.length > 0 && xml.includes('</urlset>')) {
    xml = xml.replace('</urlset>', `${newUrls.join('\n')}\n</urlset>`);
  }

  // 5. Always write the canonical-domain-standardized sitemap
  fs.writeFileSync(SITEMAP_PATH, xml.trim() + '\n', 'utf8');
  console.log(`[sitemap] Successfully updated public/sitemap.xml with standardized domain and ${newUrls.length} new entry(ies).`);
}

generateSitemap().catch(err => {
  console.error('[sitemap] Error generating sitemap, keeping existing file:', err);
});
