import type { WordPressPost } from "./api";
import type { NavDropdownItem, NavItem } from "./site";

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

function normalizeToken(value: string) {
  return value.trim().toLowerCase();
}

function buildPostCategoryTokens(post: WordPressPost) {
  const tokens = new Set<string>();
  for (const category of post.categories) {
    tokens.add(normalizeToken(category.name));
    tokens.add(normalizeToken(category.slug));
  }

  return tokens;
}

function filterPostsByCategoryTokens(posts: WordPressPost[], tokens: Set<string>) {
  if (!tokens.size) {
    return [];
  }

  return posts.filter((post) => {
    const postTokens = buildPostCategoryTokens(post);
    for (const token of tokens) {
      if (postTokens.has(token)) {
        return true;
      }
    }

    return false;
  });
}

function buildCorpus(post: WordPressPost) {
  const categories = post.categories
    .flatMap((category) => [category.name, category.slug])
    .join(" ");

  return `${post.title} ${post.slug} ${post.excerpt} ${categories}`.toLowerCase();
}

function scorePost(post: WordPressPost, terms: string[]) {
  const corpus = buildCorpus(post);
  return terms.reduce((score, term) => {
    return corpus.includes(term.toLowerCase()) ? score + 1 : score;
  }, 0);
}

function rankPosts(posts: WordPressPost[], terms: string[]) {
  return posts
    .map((post, index) => ({
      post,
      index,
      score: scorePost(post, terms),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.index - right.index;
    });
}

function getFallbackPosts(posts: WordPressPost[], seed: string, limit = 24) {
  if (posts.length <= limit) {
    return posts;
  }

  const hash = seed
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);
  const offset = hash % posts.length;
  const rotated = [...posts.slice(offset), ...posts.slice(0, offset)];
  return rotated.slice(0, limit);
}

export function getPostsForCategory(posts: WordPressPost[], category: NavItem) {
  const uniquePosts = dedupePosts(posts);
  const terms = [
    category.label,
    category.slug,
    ...category.terms,
    ...category.dropdown.map((item) => item.slug),
    ...category.dropdown.flatMap((item) => item.terms ?? []),
  ];
  const normalizedTerms = Array.from(new Set(terms.map(normalizeToken)));
  const categoryTokenMatches = filterPostsByCategoryTokens(
    uniquePosts,
    new Set(normalizedTerms),
  );

  if (categoryTokenMatches.length) {
    return categoryTokenMatches;
  }

  const ranked = rankPosts(uniquePosts, normalizedTerms);
  const matched = ranked.filter((entry) => entry.score > 0).map((entry) => entry.post);

  return matched.length ? matched : getFallbackPosts(uniquePosts, category.slug);
}

export function getPostsForSubcategory(
  posts: WordPressPost[],
  category: NavItem,
  subcategory: NavDropdownItem,
) {
  const uniquePosts = dedupePosts(posts);
  const terms = [
    category.label,
    category.slug,
    ...category.terms,
    subcategory.label,
    subcategory.slug,
    ...(subcategory.terms ?? []),
  ];
  const normalizedTerms = Array.from(new Set(terms.map(normalizeToken)));
  const categoryTokenMatches = filterPostsByCategoryTokens(
    uniquePosts,
    new Set(normalizedTerms),
  );

  if (categoryTokenMatches.length) {
    return categoryTokenMatches;
  }

  const ranked = rankPosts(uniquePosts, normalizedTerms);
  const matched = ranked.filter((entry) => entry.score > 0).map((entry) => entry.post);

  return matched.length
    ? matched
    : getFallbackPosts(uniquePosts, `${category.slug}-${subcategory.slug}`);
}
