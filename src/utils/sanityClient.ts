import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: '3zccyf67',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Super-fast edge-cached delivery
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug?: { current: string };
  publishedAt?: string;
  updatedAt?: string;
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
  bodyText?: string;
  body?: any[];
  sources?: Array<{ title: string; url?: string; notes?: string }>;
  disclaimer?: string;
  tags?: string[];
}

/**
 * Fetch all published blog posts from Sanity CMS
 */
export async function getSanityPosts(): Promise<SanityBlogPost[]> {
  try {
    const query = `*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc) {
      _id,
      title,
      slug,
      publishedAt,
      updatedAt,
      "authorName": coalesce(author->name, "MD Zafeer Hasan (YAZDAAN)"),
      "authorRole": coalesce(author->role, "Author & Independent Researcher"),
      "authorBio": author->bio,
      "authorImage": author->image,
      "category": coalesce(category, "Finance"),
      topics,
      articleType,
      readTime,
      summary,
      "mainImage": coalesce(featuredImage, mainImage),
      featuredImage,
      bodyText,
      body,
      sources,
      disclaimer,
      tags
    }`;
    const posts = await sanityClient.fetch<SanityBlogPost[]>(query);
    return posts || [];
  } catch (error) {
    console.warn('Sanity fetch notice (will fallback seamlessly):', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug or ID from Sanity CMS
 */
export async function getSanityPostBySlug(slugOrId: string): Promise<SanityBlogPost | null> {
  try {
    const query = `*[_type == "post" && (slug.current == $slugOrId || _id == $slugOrId)][0] {
      _id,
      title,
      slug,
      publishedAt,
      updatedAt,
      "authorName": coalesce(author->name, "MD Zafeer Hasan (YAZDAAN)"),
      "authorRole": coalesce(author->role, "Author & Independent Researcher"),
      "authorBio": author->bio,
      "authorImage": author->image,
      "category": coalesce(category, "Finance"),
      topics,
      articleType,
      readTime,
      summary,
      "mainImage": coalesce(featuredImage, mainImage),
      featuredImage,
      bodyText,
      body,
      sources,
      disclaimer,
      tags
    }`;
    const post = await sanityClient.fetch<SanityBlogPost | null>(query, { slugOrId });
    return post || null;
  } catch (error) {
    console.warn('Sanity fetch single post notice:', error);
    return null;
  }
}
