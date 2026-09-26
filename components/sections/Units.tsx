import { unitById, type UnitId } from "@/lib/data";
import { Bay, type BayLayout } from "@/components/units/Bay";
import { screens } from "@/components/mockups/registry";
import { SectionHead } from "@/components/ui/SectionHead";
import { FlapDisplay } from "@/components/board/FlapDisplay";

const plan: { id: UnitId; layout: BayLayout }[] = [
  { id: "vendor-app", layout: "split-left" },
  { id: "trading-portal", layout: "wide" },
  { id: "vendor-portal", layout: "split-right" },
  { id: "wws-dashboards", layout: "wide" },
  { id: "api-platform", layout: "split-left" },
];

const own: { id: UnitId; layout: BayLayout }[] = [
  { id: "osai", layout: "wide" },
  { id: "stone-chisel", layout: "split-right" },
];

export function Units() {
  return (
    <section id="work" className="seam section-pad" aria-labelledby="work-title">
      <div className="frame">
        <SectionHead id="work-title" title="Seven systems in service">
          Five I build at FatHopes Energy and two I build on my own time. Every screen below is a working
          recreation you can click through, so go ahead and press things.
        </SectionHead>

        <div className="mt-[calc(var(--cell)*3)] grid grid-cols-1 gap-[calc(var(--cell)*4.5)]">
          {plan.map(({ id, layout }) => (
            <Bay key={id} unit={unitById[id]} layout={layout} screen={screens[id]} wellClassName={id === "vendor-app" ? "flex justify-center" : ""} />
          ))}
        </div>

        <div className="my-[calc(var(--cell)*4.5)] grid gap-[calc(var(--cell)*0.8)] md:grid-cols-[auto_1fr] md:items-center">
          <div className="housing inline-flex w-max p-[calc(var(--cell)*0.22)]" aria-hidden>
            <div className="well inline-flex px-[calc(var(--cell)*0.3)] py-[calc(var(--cell)*0.24)]">
              <FlapDisplay text="OFF SHIFT" cellClassName="cell-bay" intro="view" decorative />
            </div>
          </div>
          <div>
            <h3 className="sr-only">Built on my own time</h3>
            <p className="max-w-[46ch] text-[1.3125rem] leading-[1.35] font-medium text-ink">
              Two products I design, build and ship on my own time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[calc(var(--cell)*4.5)]">
          {own.map(({ id, layout }) => (
            <Bay key={id} unit={unitById[id]} layout={layout} screen={screens[id]} />
          ))}
        </div>
      </div>
    </section>
  );
}
