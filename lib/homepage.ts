import type { WordPressPost } from "./api";

export type MentorAuthor = {
  name: string;
  slug: string;
  avatarUrl: string | null;
  focus: string;
};

export type HomepageData = {
  featuredPost: WordPressPost | null;
  trendingPosts: WordPressPost[];
  latestPosts: WordPressPost[];
  mentorsFeature: WordPressPost | null;
  mentorAuthors: MentorAuthor[];
  youthPosts: WordPressPost[];
  womensPosts: WordPressPost[];
  culturePosts: WordPressPost[];
  appCtaPost: WordPressPost | null;
};

const SECTION_KEYWORDS = {
  mentors: ["mentor", "video", "exclusive"],
  youth: ["youth", "academy", "path", "next-up", "u18", "grassroots"],
  womens: ["women", "wsl", "female"],
  culture: ["culture", "interview", "feature", "analysis", "conversation"],
};

function tokenizePost(post: WordPressPost) {
  const categoryText = post.categories
    .flatMap((category) => [category.name, category.slug])
    .join(" ");
  const corpus = `${post.title} ${post.slug} ${post.excerpt} ${categoryText}`.toLowerCase();
  return corpus;
}

function scorePost(post: WordPressPost, keywords: string[]) {
  const corpus = tokenizePost(post);
  return keywords.reduce(
    (score, keyword) => (corpus.includes(keyword) ? score + 1 : score),
    0,
  );
}

function selectPosts(
  posts: WordPressPost[],
  usedIds: Set<string>,
  keywords: string[],
  limit: number,
) {
  const ranked = posts
    .map((post, index) => ({
      post,
      index,
      score: scorePost(post, keywords),
    }))
    .filter((entry) => !usedIds.has(entry.post.id))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.index - right.index;
    });

  const selected: WordPressPost[] = [];

  for (const entry of ranked) {
    if (selected.length >= limit) {
      break;
    }

    if (entry.score > 0) {
      selected.push(entry.post);
      usedIds.add(entry.post.id);
    }
  }

  if (selected.length < limit) {
    for (const post of posts) {
      if (selected.length >= limit) {
        break;
      }

      if (!usedIds.has(post.id)) {
        selected.push(post);
        usedIds.add(post.id);
      }
    }
  }

  return selected;
}

function getAuthorFocus(posts: WordPressPost[]) {
  const buckets = new Map<string, number>();

  for (const post of posts) {
    for (const category of post.categories) {
      const name = category.name.trim();
      if (!name) {
        continue;
      }
      buckets.set(name, (buckets.get(name) ?? 0) + 1);
    }
  }

  return Array.from(buckets.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([name]) => name);
}

function toFocusLabel(categoryName?: string) {
  if (!categoryName) {
    return "Editorial analysis and reporting";
  }

  return `${categoryName} coverage and analysis`;
}

function getMentorAuthors(posts: WordPressPost[]): MentorAuthor[] {
  const categoryFocus = getAuthorFocus(posts);
  const byAuthor = new Map<
    string,
    {
      count: number;
      name: string;
      slug: string;
      avatarUrl: string | null;
      categories: string[];
    }
  >();

  for (const post of posts) {
    const key = post.authorSlug;
    const existing = byAuthor.get(key);
    const categoryNames = post.categories.map((category) => category.name);

    if (existing) {
      existing.count += 1;
      existing.categories.push(...categoryNames);
      continue;
    }

    byAuthor.set(key, {
      count: 1,
      name: post.authorName,
      slug: post.authorSlug,
      avatarUrl: post.authorAvatarUrl,
      categories: [...categoryNames],
    });
  }

  return Array.from(byAuthor.values())
    .sort((left, right) => right.count - left.count)
    .slice(0, 3)
    .map((author) => {
      const preferredCategory =
        author.categories.find((name) =>
          categoryFocus.some((focusName) => focusName === name),
        ) ?? categoryFocus[0];

      return {
        name: author.name,
        slug: author.slug,
        avatarUrl: author.avatarUrl,
        focus: toFocusLabel(preferredCategory),
      };
    });
}

export function buildHomepageData(posts: WordPressPost[]): HomepageData {
  const [featuredPost, ...remainingPosts] = posts;
  const usedIds = new Set<string>();

  if (featuredPost) {
    usedIds.add(featuredPost.id);
  }

  const latestPosts = selectPosts(remainingPosts, usedIds, ["news"], 3);
  const mentorsFeature = selectPosts(
    remainingPosts,
    usedIds,
    SECTION_KEYWORDS.mentors,
    1,
  )[0] ?? null;
  const youthPosts = selectPosts(
    remainingPosts,
    usedIds,
    SECTION_KEYWORDS.youth,
    3,
  );
  const womensPosts = selectPosts(
    remainingPosts,
    usedIds,
    SECTION_KEYWORDS.womens,
    3,
  );
  const culturePosts = selectPosts(
    remainingPosts,
    usedIds,
    SECTION_KEYWORDS.culture,
    2,
  );
  const appCtaPost =
    remainingPosts.find((post) => !usedIds.has(post.id)) ?? featuredPost ?? null;

  return {
    featuredPost: featuredPost ?? null,
    trendingPosts: posts.slice(0, 8),
    latestPosts,
    mentorsFeature,
    mentorAuthors: getMentorAuthors(posts),
    youthPosts,
    womensPosts,
    culturePosts,
    appCtaPost,
  };
}
