import { stats } from "@/lib/data";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/Reveal";

export function Stats() {
  return (
    <section className="relative py-6">
      <div className="container-x">
        <Reveal>
          <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-3xl md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white/[0.012] px-6 py-9 text-center sm:py-10"
              >
                <div className="font-display text-4xl font-semibold sm:text-5xl">
                  <span className="aurora-text">
                    <Counter value={s.value} suffix={s.suffix} />
                  </span>
                </div>
                <div className="mt-2 text-sm font-medium text-ink">{s.label}</div>
                {s.hint && (
                  <div className="mt-1 text-xs text-ink-faint">{s.hint}</div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
