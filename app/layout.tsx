import type { Metadata, Viewport } from "next";
import { Archivo, Fraunces, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";
import { profile } from "@/lib/data";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  display: "swap",
});

// The next four only dress the recreated app screens, so they never block paint.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const title = `${profile.name}, ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jullienazreen.com"),
  alternates: { canonical: "/" },
  title: {
    default: title,
    template: `%s · ${profile.name}`,
  },
  description: profile.metaDescription,
  keywords: [
    "Jullien Nazreen",
    "Full-Stack Developer",
    "Next.js",
    "Flutter",
    "TypeScript",
    "GraphQL",
    "Nitro",
    "Prisma",
    "Malaysia",
    "Portfolio",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    title,
    description: profile.metaDescription,
    url: "https://www.jullienazreen.com",
    type: "website",
    locale: "en_US",
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.metaDescription,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d6dbd4" },
    { media: "(prefers-color-scheme: dark)", color: "#151815" },
  ],
};

// Runs before first paint: restores the shift (day or night) and, when motion
// is welcome, arms the split-flap intro and scroll reveals. If hydration never
// arrives, a timer disarms everything so the content still shows.
const bootScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("shift");if(t!=="day"&&t!=="night"){t=matchMedia("(prefers-color-scheme: dark)").matches?"night":"day"}d.setAttribute("data-theme",t);if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("motion-ok");window.__bootT=setTimeout(function(){d.classList.remove("motion-ok")},4500)}}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="day"
      className={`${archivo.variable} ${inter.variable} ${fraunces.variable} ${jetbrains.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
