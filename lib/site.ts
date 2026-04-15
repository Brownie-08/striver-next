export const SITE_NAME = "Striver";
export const SITE_DESCRIPTION =
  "Striver is a headless WordPress frontend rebuilt with Next.js App Router and WPGraphQL.";
export const DEFAULT_SITE_URL = "http://localhost:3000";

export type NavDropdownItem = {
  label: string;
  slug: string;
  href: string;
  terms?: string[];
};

export type NavItem = {
  label: string;
  slug: string;
  href: string;
  description: string;
  terms: string[];
  dropdown: NavDropdownItem[];
};

export type TrendingTopic = {
  label: string;
  href: string;
};

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!siteUrl) {
    return DEFAULT_SITE_URL;
  }

  return siteUrl.replace(/\/+$/, "");
}

export const primaryNav: NavItem[] = [
  {
    label: "Men's Football",
    slug: "mens-football",
    href: "/mens-football",
    description:
      "Top-flight analysis, transfers, and league storylines from the men's game.",
    terms: [
      "premier league",
      "news-premier-league",
      "brazil",
      "brasileirao",
      "campeonato brasileiro",
      "champions league",
      "transfer",
    ],
    dropdown: [
      {
        label: "Premier League",
        slug: "premier-league",
        href: "/mens-football/premier-league",
        terms: ["premier league", "news-premier-league", "premier-league"],
      },
      {
        label: "Brazilian football",
        slug: "brazilian-football",
        href: "/mens-football/brazilian-football",
        terms: ["brazil", "brasileirao", "campeonato brasileiro", "flamengo"],
      },
      {
        label: "Campeonato Brasileiro",
        slug: "campeonato-brasileiro",
        href: "/mens-football/campeonato-brasileiro",
        terms: ["campeonato brasileiro", "brasileirao", "brazil"],
      },
      {
        label: "Champions League",
        slug: "champions-league",
        href: "/mens-football/champions-league",
        terms: ["champions league", "ucl"],
      },
    ],
  },
  {
    label: "Women's Football",
    slug: "womens-football",
    href: "/womens-football",
    description:
      "Coverage of elite competition, pathway stories, and the players shaping the women's game.",
    terms: ["women", "wsl", "female", "women football"],
    dropdown: [
      {
        label: "WSL",
        slug: "wsl",
        href: "/womens-football/wsl",
        terms: ["wsl", "women super league", "women football"],
      },
      {
        label: "Champions League",
        slug: "champions-league",
        href: "/womens-football/champions-league",
        terms: ["women champions league", "champions league", "uwcl"],
      },
      {
        label: "International",
        slug: "international",
        href: "/womens-football/international",
        terms: ["international", "world cup", "women football"],
      },
    ],
  },
  {
    label: "Youth Football",
    slug: "youth-football",
    href: "/youth-football",
    description:
      "Player pathways, academy environments, and youth competition coverage.",
    terms: ["youth", "academy", "path", "next up", "u18", "grassroots"],
    dropdown: [
      {
        label: "The Path",
        slug: "the-path",
        href: "/youth-football/the-path",
        terms: ["the path", "pathway", "path"],
      },
      {
        label: "Next Up",
        slug: "next-up",
        href: "/youth-football/next-up",
        terms: ["next up", "next generation", "prospect"],
      },
      {
        label: "Grassroots",
        slug: "grassroots",
        href: "/youth-football/grassroots",
        terms: ["grassroots", "community", "local"],
      },
      {
        label: "Academy",
        slug: "academy",
        href: "/youth-football/academy",
        terms: ["academy", "youth", "development"],
      },
      {
        label: "U18 Competitions",
        slug: "u18-competitions",
        href: "/youth-football/u18-competitions",
        terms: ["u18", "under-18", "youth competition", "fa youth cup"],
      },
    ],
  },
  {
    label: "Tournaments",
    slug: "tournaments",
    href: "/tournaments",
    description:
      "Cup runs, knockout football, and international tournament watchlists.",
    terms: ["tournament", "cup", "knockout", "champions league", "fa cup"],
    dropdown: [
      {
        label: "FA Cup",
        slug: "fa-cup",
        href: "/tournaments/fa-cup",
        terms: ["fa cup", "emirates fa cup", "cup"],
      },
      {
        label: "Champions League",
        slug: "champions-league",
        href: "/tournaments/champions-league",
        terms: ["champions league", "ucl"],
      },
      {
        label: "Copa Sao Paulo",
        slug: "copa-sao-paulo",
        href: "/tournaments/copa-sao-paulo",
        terms: ["copa sao paulo", "sao paulo cup", "tournament"],
      },
    ],
  },
  {
    label: "Mentors",
    slug: "mentors",
    href: "/mentors",
    description:
      "Exclusive mentor guidance, interviews, and locked video conversations in the app.",
    terms: ["mentor", "exclusive", "video", "interview"],
    dropdown: [
      {
        label: "Roberto Carlos",
        slug: "roberto-carlos",
        href: "/authors/roberto-carlos",
      },
      {
        label: "Gilberto Silva",
        slug: "gilberto-silva",
        href: "/authors/gilberto-silva",
      },
      {
        label: "Kelly Smith",
        slug: "kelly-smith",
        href: "/authors/kelly-smith",
      },
    ],
  },
];

export const trendingTopics: TrendingTopic[] = [
  { label: "Trending", href: "/latest-news" },
  { label: "Premier League", href: "/mens-football/premier-league" },
  { label: "Brazilian football", href: "/mens-football/brazilian-football" },
  {
    label: "Campeonato Brasileiro",
    href: "/mens-football/campeonato-brasileiro",
  },
  { label: "WSL", href: "/womens-football/wsl" },
  { label: "FA Youth Cup", href: "/youth-football/u18-competitions" },
  { label: "Champions League", href: "/tournaments/champions-league" },
  { label: "Transfers", href: "/mens-football" },
  { label: "The Path", href: "/youth-football/the-path" },
  { label: "Next Up", href: "/youth-football/next-up" },
];

export const footerColumns = [
  {
    title: "Football",
    links: [
      { label: "Men's Football", href: "/mens-football" },
      { label: "Women's Football", href: "/womens-football" },
      { label: "Youth Football", href: "/youth-football" },
      { label: "Tournaments", href: "/tournaments" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Mentors", href: "/mentors" },
      { label: "The Path", href: "/youth-football/the-path" },
      { label: "Next Up", href: "/youth-football/next-up" },
      { label: "Latest News", href: "/latest-news" },
    ],
  },
  {
    title: "App",
    links: [
      { label: "Download iOS", href: "/#get-the-app" },
      { label: "Download Android", href: "/#get-the-app" },
      { label: "Video Content", href: "/mentors" },
      { label: "Locked Articles", href: "/latest-news" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Contact", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Press", href: "/" },
      { label: "Policies", href: "/" },
    ],
  },
];

export const socialLinks = [
  { label: "X", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Instagram", href: "#" },
];

export function getCategoryRoute(slug: string) {
  return primaryNav.find((item) => item.slug === slug) ?? null;
}

export function getSubcategoryRoute(categorySlug: string, subcategorySlug: string) {
  const category = getCategoryRoute(categorySlug);

  if (!category) {
    return null;
  }

  return category.dropdown.find((item) => item.slug === subcategorySlug) ?? null;
}
