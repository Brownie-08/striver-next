import type { NextConfig } from "next";

function getHostname(value?: string | null) {
  if (!value?.trim()) {
    return null;
  }

  try {
    return new URL(value).hostname;
  } catch {
    return null;
  }
}

const backendUrl = process.env.WORDPRESS_BACKEND_URL;
const graphQlUrl = process.env.WORDPRESS_GRAPHQL_URL;
const restApiUrl = process.env.WORDPRESS_REST_API_URL;

const remoteHostnames = Array.from(
  new Set(
    [
      "www.striver.football",
      "striver.football",
      "secure.gravatar.com",
      "i0.wp.com",
      "i1.wp.com",
      "i2.wp.com",
      getHostname(backendUrl),
      getHostname(graphQlUrl),
      getHostname(restApiUrl),
    ].filter((value): value is string => Boolean(value)),
  ),
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: remoteHostnames.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
