import { cache } from "react";
import { getExcerpt, stripHtml } from "./utils";

const WORDPRESS_API_URL =
  process.env.WORDPRESS_GRAPHQL_URL?.trim() ||
  "https://www.striver.football/graphql";
const REVALIDATE_SECONDS = 60;
export const LIST_POST_LIMIT = 80;

type GraphQLError = {
  message: string;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

type WordPressPostNode = {
  id: string;
  title: string;
  slug: string;
  date?: string | null;
  content?: string | null;
  excerpt?: string | null;
  categories?: {
    nodes?: Array<{
      name?: string | null;
      slug?: string | null;
    } | null> | null;
  } | null;
  author?: {
    node?: {
      name?: string | null;
      slug?: string | null;
      avatar?: {
        url?: string | null;
      } | null;
    } | null;
  } | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    } | null;
  } | null;
};

export type WordPressPost = {
  id: string;
  title: string;
  slug: string;
  date: string | null;
  content: string;
  excerpt: string;
  authorName: string;
  authorSlug: string;
  authorAvatarUrl: string | null;
  categories: Array<{
    name: string;
    slug: string;
  }>;
  featuredImageUrl: string | null;
  featuredImageAlt: string;
};

function dedupePosts(posts: WordPressPost[]) {
  const seen = new Set<string>();
  const unique: WordPressPost[] = [];

  for (const post of posts) {
    const key = post.id || post.slug;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(post);
  }

  return unique;
}

const POSTS_QUERY = `
  query PostsQuery($first: Int!) {
    posts(first: $first) {
      nodes {
        id
        title
        slug
        date
        excerpt
        categories {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
            slug
            avatar {
              url
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

const POST_BY_SLUG_QUERY = `
  query PostBySlugQuery($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      excerpt
      content
      categories {
        nodes {
          name
          slug
        }
      }
      author {
        node {
          name
          slug
          avatar {
            url
          }
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

const POST_SLUGS_QUERY = `
  query PostSlugsQuery($first: Int!) {
    posts(first: $first) {
      nodes {
        slug
      }
    }
  }
`;

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(WORDPRESS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: {
      revalidate: REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(
      `GraphQL request failed with status ${response.status} ${response.statusText}`,
    );
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join("; "));
  }

  if (!json.data) {
    throw new Error("The GraphQL response did not include a data payload.");
  }

  return json.data;
}

function normalizePost(node: WordPressPostNode): WordPressPost {
  const cleanTitle = stripHtml(node.title) || "Untitled post";
  const content = node.content ?? "";
  const excerptSource = node.excerpt || "";
  const categories =
    node.categories?.nodes
      ?.map((category) => {
        const name = category?.name?.trim();
        const slug = category?.slug?.trim();

        if (!name || !slug) {
          return null;
        }

        return { name, slug };
      })
      .filter((category): category is { name: string; slug: string } =>
        Boolean(category),
      ) ?? [];
  const authorSlug = node.author?.node?.slug?.trim() || "striver-staff";

  return {
    id: node.id,
    title: cleanTitle,
    slug: node.slug,
    date: node.date ?? null,
    content,
    excerpt: getExcerpt(excerptSource),
    authorName: node.author?.node?.name?.trim() || "Striver Staff",
    authorSlug,
    authorAvatarUrl: node.author?.node?.avatar?.url?.trim() || null,
    categories,
    featuredImageUrl: node.featuredImage?.node?.sourceUrl || null,
    featuredImageAlt:
      node.featuredImage?.node?.altText?.trim() ||
      cleanTitle ||
      "Striver article image",
  };
}

export const getPosts = cache(async (first = LIST_POST_LIMIT) => {
  const data = await fetchGraphQL<{
    posts: {
      nodes: WordPressPostNode[];
    };
  }>(POSTS_QUERY, { first });

  return dedupePosts(data.posts.nodes.map(normalizePost));
});

export const getPostBySlug = cache(async (slug: string) => {
  const data = await fetchGraphQL<{
    post: WordPressPostNode | null;
  }>(POST_BY_SLUG_QUERY, { slug });

  return data.post ? normalizePost(data.post) : null;
});

export const getPostSlugs = cache(async (first = 24) => {
  const data = await fetchGraphQL<{
    posts: {
      nodes: Array<{
        slug: string;
      }>;
    };
  }>(POST_SLUGS_QUERY, { first });

  return data.posts.nodes.map((node) => node.slug);
});
