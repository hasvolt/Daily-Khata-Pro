import express from "express";
import path from "path";
import fs from "fs";
import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: "3zccyf67",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const SANITY_POSTS_QUERY = `*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc) {
  _id,
  title,
  slug,
  publishedAt,
  updatedAt,
  author->{
    _id,
    name,
    role,
    professionalDescription,
    bio,
    "profilePhoto": coalesce(profilePhoto, image)
  },
  "authorName": coalesce(author->name, authorName, "MD Zafeer Hasan (YAZDAAN)"),
  "authorRole": coalesce(author->role, author->professionalDescription, authorRole, "Author & Independent Researcher"),
  "authorBio": coalesce(author->bio, authorBio),
  "authorImage": coalesce(author->profilePhoto, author->image, authorImage),
  "category": coalesce(category->name, category, "Finance"),
  "topics": coalesce(select(defined(topics[0]._ref) => topics[]->name[@ != null], topics), []),
  articleType,
  readTime,
  "summary": coalesce(excerpt, summary),
  "excerpt": coalesce(excerpt, summary),
  "mainImage": coalesce(featuredImage, mainImage),
  featuredImage,
  attachedFile,
  bodyText,
  body,
  sources,
  disclaimer,
  tags
}`;

const SANITY_SINGLE_POST_QUERY = `*[_type == "post" && (slug.current == $slugOrId || _id == $slugOrId || slug.current == $cleanId || _id == $cleanId)][0] {
  _id,
  title,
  slug,
  publishedAt,
  updatedAt,
  author->{
    _id,
    name,
    role,
    professionalDescription,
    bio,
    "profilePhoto": coalesce(profilePhoto, image)
  },
  "authorName": coalesce(author->name, authorName, "MD Zafeer Hasan (YAZDAAN)"),
  "authorRole": coalesce(author->role, author->professionalDescription, authorRole, "Author & Independent Researcher"),
  "authorBio": coalesce(author->bio, authorBio),
  "authorImage": coalesce(author->profilePhoto, author->image, authorImage),
  "category": coalesce(category->name, category, "Finance"),
  "topics": coalesce(select(defined(topics[0]._ref) => topics[]->name[@ != null], topics), []),
  articleType,
  readTime,
  "summary": coalesce(excerpt, summary),
  "excerpt": coalesce(excerpt, summary),
  "mainImage": coalesce(featuredImage, mainImage),
  featuredImage,
  attachedFile,
  bodyText,
  body,
  sources,
  disclaimer,
  tags
}`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Sanity Blog API proxy endpoints (immune to CORS restrictions in all preview, dev, and custom environments)
  app.get('/api/sanity-posts', async (req, res) => {
    try {
      const posts = await sanityClient.fetch(SANITY_POSTS_QUERY);
      res.setHeader('Cache-Control', 'public, max-age=10, s-maxage=30');
      res.json(posts || []);
    } catch (err: any) {
      console.warn('API /api/sanity-posts fetch failed:', err);
      res.status(500).json({ error: 'Failed to fetch Sanity posts', message: err?.message });
    }
  });

  app.get('/api/sanity-post/:slugOrId', async (req, res) => {
    try {
      const { slugOrId } = req.params;
      const cleanSlug = (slugOrId || '').trim().replace(/\/+$/, '');
      const cleanId = cleanSlug.replace(/^sanity-/, '');
      const post = await sanityClient.fetch(SANITY_SINGLE_POST_QUERY, { slugOrId: cleanSlug, cleanId });
      res.setHeader('Cache-Control', 'public, max-age=10, s-maxage=30');
      res.json(post || null);
    } catch (err: any) {
      console.warn('API /api/sanity-post fetch failed:', err);
      res.status(500).json({ error: 'Failed to fetch Sanity post', message: err?.message });
    }
  });

  // Explicit route for Google AdSense ads.txt verification
  app.get('/ads.txt', (req, res) => {
    const adsPath = path.join(process.cwd(), 'public', 'ads.txt');
    if (fs.existsSync(adsPath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.sendFile(adsPath);
    } else {
      res.type('text/plain').send('google.com, pub-4744063610455678, DIRECT, f08c47fec0942fa0\n');
    }
  });

  // Dynamic Sitemap XML incorporating published Sanity Blog articles
  app.get('/sitemap.xml', async (req, res) => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    let baseXml = '';
    if (fs.existsSync(sitemapPath)) {
      baseXml = fs.readFileSync(sitemapPath, 'utf8');
    }

    try {
      // Query all published posts with valid slugs
      const posts: Array<{ slug: string; _updatedAt?: string; publishedAt?: string }> = await sanityClient.fetch(
        `*[_type == "post" && defined(slug.current)] {
          "slug": slug.current,
          _updatedAt,
          publishedAt
        }`
      );

      const dynamicUrls: string[] = [];
      const CANONICAL_DOMAIN = 'https://www.rozfiber.com';

      // Always ensure /blog root is in the sitemap if not present
      if (!baseXml.includes('<loc>https://www.rozfiber.com/blog</loc>') && !baseXml.includes('<loc>https://rozfiber.com/blog</loc>')) {
        dynamicUrls.push(`  <url>\n    <loc>${CANONICAL_DOMAIN}/blog</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`);
      }

      posts.forEach(post => {
        if (!post.slug) return;
        const lastmod = post._updatedAt ? post._updatedAt.split('T')[0] : (post.publishedAt ? post.publishedAt.split('T')[0] : '');
        const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
        dynamicUrls.push(`  <url>\n    <loc>${CANONICAL_DOMAIN}/blog/${encodeURIComponent(post.slug)}</loc>${lastmodTag}\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
      });

      if (baseXml && baseXml.includes('</urlset>')) {
        const insertion = dynamicUrls.length > 0 ? dynamicUrls.join('\n') + '\n' : '';
        const enrichedXml = baseXml.replace('</urlset>', `${insertion}</urlset>`);
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
        return res.send(enrichedXml);
      }
    } catch (err) {
      console.warn('Failed to query Sanity posts for dynamic sitemap:', err);
    }

    // Fallback: send base sitemap if Sanity fetch fails or baseXml doesn't have </urlset>
    if (baseXml) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.send(baseXml);
    }
    res.status(404).send('Sitemap not found');
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static files from dist
    const distPath = path.join(__dirname, '..', 'dist');
    
    // Check if dist exists (handle case where server.cjs is inside dist or outside)
    const servePath = fs.existsSync(distPath) ? distPath : path.join(__dirname, 'dist');
    
    app.use(express.static(servePath));
    
    // SPA Fallback
    app.get('*all', (req, res) => {
      res.sendFile(path.join(servePath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
