import { cache } from "react";
import { getExcerpt, stripHtml } from "./utils";

const DEFAULT_WORDPRESS_BACKEND_URL = "https://www.striver.football";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

const WORDPRESS_BACKEND_URL = trimTrailingSlash(
  process.env.WORDPRESS_BACKEND_URL?.trim() || DEFAULT_WORDPRESS_BACKEND_URL,
);
const WORDPRESS_GRAPHQL_URL = trimTrailingSlash(
  process.env.WORDPRESS_GRAPHQL_URL?.trim() ||
    `${WORDPRESS_BACKEND_URL}/graphql`,
);
const WORDPRESS_REST_API_URL = trimTrailingSlash(
  process.env.WORDPRESS_REST_API_URL?.trim() ||
    `${WORDPRESS_BACKEND_URL}/wp-json/wp/v2`,
);
const REVALIDATE_SECONDS = 60;
export const LIST_POST_LIMIT = 80;
const seenApiLogKeys = new Set<string>();

function logApi(
  level: "warn" | "error",
  key: string,
  message: string,
  payload?: Record<string, unknown>,
) {
  if (process.env.NODE_ENV === "production") {
    if (seenApiLogKeys.has(key)) {
      return;
    }
    seenApiLogKeys.add(key);
  }

  if (payload) {
    console[level](message, payload);
    return;
  }

  console[level](message);
}

type GraphQLError = {
  message: string;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

type WordPressRestPostNode = {
  id: number;
  title?: {
    rendered?: string | null;
  } | null;
  slug: string;
  status?: string | null;
  date?: string | null;
  content?: {
    rendered?: string | null;
  } | null;
  excerpt?: {
    rendered?: string | null;
  } | null;
  _embedded?: {
    author?: Array<
      | {
          name?: string | null;
          slug?: string | null;
          avatar_urls?: Record<string, string> | null;
        }
      | null
    >;
    "wp:featuredmedia"?: Array<
      | {
          source_url?: string | null;
          alt_text?: string | null;
        }
      | null
    >;
    "wp:term"?: Array<
      | Array<
          | {
              name?: string | null;
              slug?: string | null;
              taxonomy?: string | null;
            }
          | null
        >
      | null
    >;
  } | null;
};

type WordPressPostNode = {
  id: string;
  title: string;
  slug: string;
  status?: string | null;
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
    posts(first: $first, where: { status: PUBLISH }) {
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
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      status
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
    posts(first: $first, where: { status: PUBLISH }) {
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
  const response = await fetch(WORDPRESS_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
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

  const rawResponse = await response.text();

  if (!response.ok) {
    throw new Error(
      `GraphQL request failed with status ${response.status} ${response.statusText}. Body preview: ${rawResponse.slice(0, 180)}`,
    );
  }

  let json: GraphQLResponse<T>;
  try {
    json = JSON.parse(rawResponse) as GraphQLResponse<T>;
  } catch {
    throw new Error(
      `GraphQL response was not valid JSON. Body preview: ${rawResponse.slice(0, 180)}`,
    );
  }

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join("; "));
  }

  if (!json.data) {
    throw new Error("The GraphQL response did not include a data payload.");
  }

  return json.data;
}

async function fetchWordPressREST<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const searchParams = new URLSearchParams(params);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const queryString = searchParams.toString();
  const url = `${WORDPRESS_REST_API_URL}${normalizedPath}${queryString ? `?${queryString}` : ""}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: REVALIDATE_SECONDS,
    },
  });
  const rawResponse = await response.text();

  if (!response.ok) {
    throw new Error(
      `REST request failed with status ${response.status} ${response.statusText}. URL: ${url}. Body preview: ${rawResponse.slice(0, 180)}`,
    );
  }

  try {
    return JSON.parse(rawResponse) as T;
  } catch {
    throw new Error(
      `REST response was not valid JSON. URL: ${url}. Body preview: ${rawResponse.slice(0, 180)}`,
    );
  }
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
    authorAvatarUrl: normalizeImageUrl(node.author?.node?.avatar?.url),
    categories,
    featuredImageUrl: normalizeImageUrl(node.featuredImage?.node?.sourceUrl),
    featuredImageAlt:
      node.featuredImage?.node?.altText?.trim() ||
      cleanTitle ||
      "Striver article image",
  };
}

function getCategoryTerms(node: WordPressRestPostNode) {
  const termGroups = node._embedded?.["wp:term"] ?? [];
  const terms = termGroups.flatMap((group) => group ?? []);
  const categories = terms.filter(
    (term) =>
      term?.name?.trim() &&
      term?.slug?.trim() &&
      (!term?.taxonomy || term.taxonomy === "category"),
  );

  const uniqueCategories = new Map<string, { name: string; slug: string }>();
  for (const category of categories) {
    const slug = category?.slug?.trim();
    const name = category?.name?.trim();
    if (!slug || !name) {
      continue;
    }
    uniqueCategories.set(slug, { name, slug });
  }

  return Array.from(uniqueCategories.values());
}

function getAuthorAvatarUrl(
  avatarUrls: Record<string, string> | null | undefined,
) {
  if (!avatarUrls) {
    return null;
  }

  return (
    normalizeImageUrl(
      avatarUrls["96"] ||
        avatarUrls["48"] ||
        avatarUrls["24"] ||
        Object.values(avatarUrls)[0],
    ) || null
  );
}

function normalizeImageUrl(value: string | null | undefined) {
  if (!value?.trim()) {
    return null;
  }

  const raw = value.trim();

  if (raw.startsWith("//")) {
    try {
      return new URL(`https:${raw}`).toString();
    } catch {
      return null;
    }
  }

  if (raw.startsWith("/")) {
    try {
      const relativeUrl = new URL(raw, `${WORDPRESS_BACKEND_URL}/`);
      if (relativeUrl.protocol === "http:") {
        relativeUrl.protocol = "https:";
      }
      return relativeUrl.toString();
    } catch {
      return null;
    }
  }

  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "http:") {
      parsed.protocol = "https:";
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function normalizeRestPost(node: WordPressRestPostNode): WordPressPost {
  const cleanTitle = stripHtml(node.title?.rendered ?? "") || "Untitled post";
  const content = node.content?.rendered ?? "";
  const excerptSource = node.excerpt?.rendered ?? content;
  const author = node._embedded?.author?.[0];
  const featuredMedia = node._embedded?.["wp:featuredmedia"]?.[0];

  return {
    id: String(node.id),
    title: cleanTitle,
    slug: node.slug,
    date: node.date ?? null,
    content,
    excerpt: getExcerpt(excerptSource),
    authorName: author?.name?.trim() || "Striver Staff",
    authorSlug: author?.slug?.trim() || "striver-staff",
    authorAvatarUrl: getAuthorAvatarUrl(author?.avatar_urls),
    categories: getCategoryTerms(node),
    featuredImageUrl: normalizeImageUrl(featuredMedia?.source_url),
    featuredImageAlt:
      featuredMedia?.alt_text?.trim() || cleanTitle || "Striver article image",
  };
}

export const getPosts = cache(async (first = LIST_POST_LIMIT) => {
  try {
    const data = await fetchGraphQL<{
      posts: {
        nodes: WordPressPostNode[];
      };
    }>(POSTS_QUERY, { first });
    const posts = dedupePosts(data.posts.nodes.map(normalizePost));
    if (posts.length) {
      return posts;
    }
    logApi("warn", "getPosts:graphql-empty", "[getPosts] GraphQL returned no posts, trying REST fallback", {
      first,
      endpoint: WORDPRESS_GRAPHQL_URL,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logApi("error", "getPosts:graphql-failed", "[getPosts] GraphQL fetch failed", {
      first,
      message,
    });
  }

  try {
    const perPage = Math.max(1, Math.min(first, 100));
    const data = await fetchWordPressREST<WordPressRestPostNode[]>("/posts", {
      per_page: String(perPage),
      status: "publish",
      _embed: "author,wp:featuredmedia,wp:term",
    });
    return dedupePosts(data.map(normalizeRestPost));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logApi("error", "getPosts:rest-failed", "[getPosts] REST fetch failed", {
      first,
      message,
    });
    return [];
  }
});

export const getPostBySlug = cache(async (slug: string) => {
  try {
    const data = await fetchGraphQL<{
      post: WordPressPostNode | null;
    }>(POST_BY_SLUG_QUERY, { slug });

    if (process.env.NODE_ENV !== "production") {
      console.debug("[getPostBySlug] GraphQL response summary", {
        slug,
        found: Boolean(data.post),
        status: data.post?.status ?? null,
        title: data.post?.title?.slice(0, 120) ?? null,
        hasFeaturedImage: Boolean(data.post?.featuredImage?.node?.sourceUrl),
      });
    }

    if (!data.post) {
      return null;
    }

    if (
      data.post.status &&
      data.post.status.trim().toLowerCase() !== "publish"
    ) {
      return null;
    }

    return normalizePost(data.post);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logApi("error", "getPostBySlug:graphql-failed", "[getPostBySlug] GraphQL fetch failed", {
      slug,
      message,
    });

    if (
      message.includes("403") ||
      message.toLowerCase().includes("forbidden") ||
      message.toLowerCase().includes("not allowed") ||
      message.toLowerCase().includes("authorization") ||
      message.toLowerCase().includes("not valid json")
    ) {
      logApi("warn", "getPostBySlug:rest-fallback", "[getPostBySlug] trying REST fallback", {
        slug,
        endpoint: WORDPRESS_REST_API_URL,
      });
    }
  }

  try {
    const data = await fetchWordPressREST<WordPressRestPostNode[]>("/posts", {
      slug,
      status: "publish",
      per_page: "1",
      _embed: "author,wp:featuredmedia,wp:term",
    });
    const post = data[0] ?? null;
    if (process.env.NODE_ENV !== "production") {
      console.debug("[getPostBySlug] REST response summary", {
        slug,
        found: Boolean(post),
        id: post?.id ?? null,
        status: post?.status ?? null,
        title: post?.title?.rendered
          ? stripHtml(post.title.rendered).slice(0, 120)
          : null,
        hasFeaturedImage: Boolean(post?._embedded?.["wp:featuredmedia"]?.[0]),
      });
    }
    if (!post) {
      return null;
    }
    return normalizeRestPost(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logApi("error", "getPostBySlug:rest-failed", "[getPostBySlug] REST fetch failed", {
      slug,
      message,
    });
    return null;
  }
});

export const getPostSlugs = cache(async (first = 24) => {
  try {
    const data = await fetchGraphQL<{
      posts: {
        nodes: Array<{
          slug: string;
        }>;
      };
    }>(POST_SLUGS_QUERY, { first });

    const slugs = data.posts.nodes.map((node) => node.slug).filter(Boolean);
    if (slugs.length) {
      return slugs;
    }
    logApi("warn", "getPostSlugs:graphql-empty", "[getPostSlugs] GraphQL returned no slugs, trying REST fallback", {
      first,
      endpoint: WORDPRESS_GRAPHQL_URL,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logApi("error", "getPostSlugs:graphql-failed", "[getPostSlugs] GraphQL fetch failed", {
      first,
      message,
    });
  }

  try {
    const perPage = Math.max(1, Math.min(first, 100));
    const data = await fetchWordPressREST<Array<{ slug?: string }>>("/posts", {
      per_page: String(perPage),
      status: "publish",
      _fields: "slug",
    });
    return data
      .map((node) => node.slug?.trim())
      .filter((slug): slug is string => Boolean(slug));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logApi("error", "getPostSlugs:rest-failed", "[getPostSlugs] REST fetch failed", {
      first,
      message,
    });
    return [];
  }
});
