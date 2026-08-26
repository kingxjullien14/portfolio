import type { Metadata, Viewport } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { MotionProvider } from "@/components/MotionProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { profile } from "@/lib/data";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jullienazreen.com"),
  alternates: { canonical: "/" },
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.heroSub,
  keywords: [
    "Jullien Nazreen",
    "Full-Stack Developer",
    "Next.js",
    "React",
    "Flutter",
    "TypeScript",
    "GraphQL",
    "Node.js",
    "Malaysia",
    "Portfolio",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.heroSub,
    url: "https://www.jullienazreen.com",
    type: "website",
    locale: "en_US",
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.heroSub,
  },
};

export const viewport: Viewport = {
  themeColor: "#08040e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <AuroraBackground />
        <div className="grain-overlay" aria-hidden />
        <MotionProvider>
          <Cursor />
          <SmoothScroll>
            <Nav />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
