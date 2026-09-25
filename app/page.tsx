import { Boot } from "@/components/Boot";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ConsoleStrip } from "@/components/console/ConsoleStrip";
import { Hero } from "@/components/sections/Hero";
import { Flow } from "@/components/sections/Flow";
import { Units } from "@/components/sections/Units";
import { Toolkit } from "@/components/sections/Toolkit";
import { Operator } from "@/components/sections/Operator";
import { Record } from "@/components/sections/Record";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <a href="#work" className="sr-only-focusable fixed left-3 top-3 z-[60] rounded-md bg-ink px-3 py-2 text-sm text-panel">
        Skip to the work
      </a>
      <ConsoleStrip />
      <main>
        <Hero />
        <Flow />
        <Units />
        <Toolkit />
        <Operator />
        <Record />
        <Contact />
      </main>
      <Footer />
      <Boot />
    </SmoothScroll>
  );
}
