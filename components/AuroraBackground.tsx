/**
 * Fixed ambient backdrop — the site's signature.
 * Deep-space canvas + drifting aurora blooms + a faint engineering grid.
 * Pure CSS so it stays cheap; motion is disabled via reduced-motion in globals.css.
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void"
    >
      {/* engineering grid, fading downward from the hero */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(184,128,224,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(184,128,224,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 55% at 50% 0%, #000 25%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 55% at 50% 0%, #000 25%, transparent 72%)",
        }}
      />

      {/* aurora blooms */}
      <div
        className="aurora-blob"
        style={{
          top: "-12%",
          left: "-6%",
          width: "42rem",
          height: "42rem",
          background:
            "radial-gradient(circle at center, rgba(180,91,207,0.55), transparent 68%)",
          animation: "drift-a 20s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          top: "4%",
          right: "-12%",
          width: "38rem",
          height: "38rem",
          background:
            "radial-gradient(circle at center, rgba(122,92,255,0.42), transparent 68%)",
          animation: "drift-b 26s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          bottom: "-18%",
          left: "18%",
          width: "46rem",
          height: "46rem",
          background:
            "radial-gradient(circle at center, rgba(240,106,182,0.32), transparent 70%)",
          animation: "drift-c 30s ease-in-out infinite",
        }}
      />

      {/* top accent glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% -8%, rgba(180,91,207,0.18), transparent 70%)",
        }}
      />
      {/* edge vignette to seat content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 120% at 50% 35%, transparent 52%, rgba(4,2,8,0.72))",
        }}
      />
    </div>
  );
}
