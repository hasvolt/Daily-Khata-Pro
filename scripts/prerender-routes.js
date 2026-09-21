import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '..', 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');
const CANONICAL_DOMAIN = 'https://www.rozfiber.com';

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function customizeHtml(baseHtml, { canonicalUrl, title, description, h1Text }) {
  let html = baseHtml;

  // Replace Title
  if (title) {
    const escapedTitle = escapeHtml(title);
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapedTitle}</title>`);
    html = html.replace(/<meta name="title" content="[^"]*"/i, `<meta name="title" content="${escapedTitle}"`);
    html = html.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${escapedTitle}"`);
    html = html.replace(/<meta name="twitter:title" content="[^"]*"/i, `<meta name="twitter:title" content="${escapedTitle}"`);
  }

  // Replace Description
  if (description) {
    const escapedDesc = escapeHtml(description);
    html = html.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${escapedDesc}"`);
    html = html.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${escapedDesc}"`);
    html = html.replace(/<meta name="twitter:description" content="[^"]*"/i, `<meta name="twitter:description" content="${escapedDesc}"`);
  }

  // Replace Canonical, og:url, twitter:url
  if (canonicalUrl) {
    html = html.replace(/<link rel="canonical"[^>]*href="[^"]*"[^>]*>/i, `<link rel="canonical" id="canonical-url" href="${canonicalUrl}" />`);
    html = html.replace(/<meta property="og:url" content="[^"]*"/i, `<meta property="og:url" content="${canonicalUrl}"`);
    html = html.replace(/<meta name="twitter:url" content="[^"]*"/i, `<meta name="twitter:url" content="${canonicalUrl}"`);
  }

  // Insert accessible crawlable H1 inside #root before React mounts
  if (h1Text) {
    const escapedH1 = escapeHtml(h1Text);
    const h1Tag = `<h1 class="sr-only">${escapedH1}</h1>`;
    if (html.includes('<div id="root">')) {
      html = html.replace('<div id="root">', `<div id="root">${h1Tag}`);
    }
  }

  return html;
}

async function prerenderRoutes() {
  console.log('[prerender] Starting route pre-rendering for SEO...');

  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.warn('[prerender] dist/index.html does not exist yet. Skipping prerender step.');
    return;
  }

  const baseHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

  // 1. Generate /blog/index.html
  const blogDir = path.join(DIST_DIR, 'blog');
  fs.mkdirSync(blogDir, { recursive: true });

  const blogHtml = customizeHtml(baseHtml, {
    canonicalUrl: `${CANONICAL_DOMAIN}/blog`,
    title: 'Business Insights & Articles | Daily Khata Pro',
    description: 'Explore research-based finance articles, practical business guides, and money management strategies on Rozfiber Finance Blog.',
    h1Text: 'Rozfiber Finance Blog',
  });

  fs.writeFileSync(path.join(blogDir, 'index.html'), blogHtml, 'utf8');
  console.log('[prerender] Created dist/blog/index.html');

  // 2. Fetch published Sanity posts with valid slugs
  let posts = [];
  try {
    const query = encodeURIComponent('*[_type == "post" && defined(slug.current)] { "slug": slug.current, title, excerpt }');
    const apiUrl = `https://3zccyf67.api.sanity.io/v2024-01-01/data/query/production?query=${query}`;
    const res = await fetch(apiUrl);
    if (res.ok) {
      const data = await res.json();
      posts = data.result || [];
    }
    console.log(`[prerender] Retrieved ${posts.length} published post(s) from Sanity.`);
  } catch (err) {
    console.warn('[prerender] Failed to fetch Sanity posts, proceeding with /blog only:', err.message);
  }

  // 3. Generate static HTML for each published article
  for (const post of posts) {
    if (!post.slug) continue;

    const postDir = path.join(blogDir, post.slug);
    fs.mkdirSync(postDir, { recursive: true });

    const articleTitle = post.title ? `${post.title} | Daily Khata Pro Finance Blog` : 'Finance Article | Daily Khata Pro';
    const articleH1 = post.title || 'Finance Article';
    const articleDesc = post.excerpt || 'Read this in-depth finance article on Daily Khata Pro.';

    const articleHtml = customizeHtml(baseHtml, {
      canonicalUrl: `${CANONICAL_DOMAIN}/blog/${post.slug}`,
      title: articleTitle,
      description: articleDesc,
      h1Text: articleH1,
    });

    fs.writeFileSync(path.join(postDir, 'index.html'), articleHtml, 'utf8');
    console.log(`[prerender] Created dist/blog/${post.slug}/index.html`);
  }

  console.log('[prerender] Finished route pre-rendering.');
}

prerenderRoutes().catch((err) => {
  console.warn('[prerender] Warning: error during pre-rendering, keeping default index.html:', err.message);
});
