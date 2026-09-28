import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: '3zccyf67',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Real-time delivery so edits show immediately
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  if (!source || (!source.asset && !source._ref && typeof source !== 'string')) {
    return {
      width: () => ({ height: () => ({ auto: () => ({ fit: () => ({ url: () => '' }) }) }) }),
      height: () => ({ auto: () => ({ fit: () => ({ url: () => '' }) }) }),
      auto: () => ({ fit: () => ({ url: () => '' }) }),
      fit: () => ({ url: () => '' }),
      url: () => ''
    } as any;
  }
  try {
    return builder.image(source);
  } catch {
    return {
      width: () => ({ height: () => ({ auto: () => ({ fit: () => ({ url: () => '' }) }) }) }),
      height: () => ({ auto: () => ({ fit: () => ({ url: () => '' }) }) }),
      auto: () => ({ fit: () => ({ url: () => '' }) }),
      fit: () => ({ url: () => '' }),
      url: () => ''
    } as any;
  }
}

export function getSanityImageUrl(source: any, width = 800, height?: number): string | null {
  if (!source) return null;
  const assetRef = source?.asset?._ref || source?._ref || (typeof source === 'string' ? source : null);
  if (!assetRef) return null;
  try {
    let img = urlFor(source).width(width).auto('format');
    if (height) img = img.height(height).fit('crop');
    const u = img.url();
    return u || null;
  } catch {
    return null;
  }
}

export interface SanitySource {
  name?: string;
  title?: string;
  url?: string;
  description?: string;
  notes?: string;
  date?: string;
}

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug?: { current: string };
  publishedAt?: string;
  updatedAt?: string;
  author?: {
    _id?: string;
    name?: string;
    role?: string;
    professionalDescription?: string;
    bio?: string;
    profilePhoto?: any;
    image?: any;
  } | null;
  authorName?: string;
  authorRole?: string;
  authorBio?: string;
  authorImage?: any;
  category?: string;
  topics?: string[];
  articleType?: string;
  readTime?: string;
  summary?: string;
  mainImage?: any;
  featuredImage?: any;
  attachedFile?: any;
  bodyText?: string;
  body?: any[];
  sources?: SanitySource[];
  disclaimer?: string;
  tags?: string[];
}

/**
 * Fetch all published blog posts from Sanity CMS
 */
export async function getSanityPosts(): Promise<SanityBlogPost[]> {
  const query = `*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc) {
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
    "category": coalesce(category->name, category->title, category, "Finance"),
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

  // 1. Try server-side API proxy first (instant & immune to browser CORS restrictions in preview/dev)
  try {
    const res = await fetch('/api/sanity-posts');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (proxyError) {
    console.warn('Sanity server proxy notice, trying direct client fetch:', proxyError);
  }

  // 2. Fallback to direct Sanity client fetch (for static hosts with CORS enabled)
  try {
    const posts = await sanityClient.fetch<SanityBlogPost[]>(query);
    if (posts && posts.length > 0) {
      return posts;
    }
  } catch (error) {
    console.warn('Direct Sanity client fetch notice:', error);
  }

  return [];
}

/**
 * Fetch a single blog post by slug or ID from Sanity CMS
 */
export async function getSanityPostBySlug(slugOrId: string): Promise<SanityBlogPost | null> {
  if (!slugOrId) return null;
  const cleanSlug = slugOrId.trim().replace(/\/+$/, '');
  const cleanId = cleanSlug.replace(/^sanity-/, '');

  const query = `*[_type == "post" && (slug.current == $slugOrId || _id == $slugOrId || slug.current == $cleanId || _id == $cleanId)][0] {
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
    "category": coalesce(category->name, category->title, category, "Finance"),
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

  // 1. Try server-side API proxy first (instant & immune to browser CORS restrictions in preview/dev)
  try {
    const res = await fetch(`/api/sanity-post/${encodeURIComponent(cleanSlug)}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data._id) {
        return data;
      }
    }
  } catch (proxyError) {
    console.warn('Sanity server single post proxy notice, trying direct client fetch:', proxyError);
  }

  // 2. Fallback to direct Sanity client fetch (for static hosts with CORS enabled)
  try {
    const post = await sanityClient.fetch<SanityBlogPost | null>(query, { slugOrId: cleanSlug, cleanId });
    if (post) {
      return post;
    }
  } catch (error) {
    console.warn('Direct Sanity single post fetch notice:', error);
  }

  return null;
}
