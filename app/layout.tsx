import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(getSiteUrl()),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [{ url: "/striver-ball.svg", type: "image/svg+xml" }],
    shortcut: "/striver-ball.svg",
    apple: "/striver-ball.svg",
  },
};

const themeInitScript = `(() => {
  try {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("striver-theme");
    if (savedTheme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  } catch {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
