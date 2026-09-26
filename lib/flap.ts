/**
 * Split-flap engine. Each cell is four half-leaves: a static top and bottom,
 * plus a top leaf that falls and a bottom leaf that lands. Distant characters
 * spin past as plain text swaps; only the final two flips animate real leaves
 * (2D transforms on the Web Animations API), so a board of a few hundred cells
 * stays smooth and never touches React state.
 */

export const FLAP_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&.-/:'";

const N = FLAP_CHARS.length;
const FALL = "cubic-bezier(0.5, 0, 0.9, 0.5)";
const LAND = "cubic-bezier(0.1, 0.6, 0.35, 1)";

function indexOf(ch: string) {
  const i = FLAP_CHARS.indexOf(ch.toUpperCase());
  return i < 0 ? 0 : i;
}

type Parts = {
  gTop: HTMLElement;
  gBot: HTMLElement;
  gLeafTop: HTMLElement;
  gLeafBot: HTMLElement;
  leafTop: HTMLElement;
  leafBot: HTMLElement;
};

export class FlapCell {
  private p: Parts;
  private current: string;
  private target: string;
  private running = false;
  private cancelled = false;
  private anims: Animation[] = [];

  constructor(el: HTMLElement, initial: string) {
    const halves = el.querySelectorAll<HTMLElement>(":scope > .flap-half");
    const glyph = (h: HTMLElement) => h.querySelector<HTMLElement>(".flap-glyph")!;
    this.p = {
      gTop: glyph(halves[0]),
      gBot: glyph(halves[1]),
      leafTop: halves[2],
      leafBot: halves[3],
      gLeafTop: glyph(halves[2]),
      gLeafBot: glyph(halves[3]),
    };
    this.current = initial;
    this.target = initial;
  }

  /** Show a character immediately, no motion. */
  set(ch: string) {
    this.stopAnims();
    this.current = ch;
    this.target = ch;
    const { gTop, gBot, gLeafTop, gLeafBot } = this.p;
    gTop.textContent = ch;
    gBot.textContent = ch;
    gLeafTop.textContent = ch;
    gLeafBot.textContent = ch;
  }

  /**
   * Spin forward through the flap sequence until `ch` shows. Long distances
   * jump ahead first so every cell settles within `maxSteps` flips.
   */
  flipTo(ch: string, stepMs: number, maxSteps: number) {
    this.target = ch;
    const dist = (indexOf(ch) - indexOf(this.current) + N) % N;
    if (dist > maxSteps) {
      const start = FLAP_CHARS[(indexOf(ch) - maxSteps + N) % N];
      if (!this.running) this.set(start);
      this.target = ch;
    }
    if (!this.running) void this.loop(stepMs);
  }

  destroy() {
    this.cancelled = true;
    this.stopAnims();
  }

  private stopAnims() {
    for (const a of this.anims) a.cancel();
    this.anims = [];
  }

  private async loop(stepMs: number) {
    this.running = true;
    try {
      while (!this.cancelled && this.current !== this.target) {
        const next = FLAP_CHARS[(indexOf(this.current) + 1) % N];
        const remaining = (indexOf(this.target) - indexOf(this.current) + N) % N;
        // far from home the characters blur past as plain swaps; the last two
        // are real leaves falling and landing
        if (remaining > 2) await this.spin(next, stepMs * 0.55);
        else await this.step(this.current, next, stepMs);
        this.current = next;
      }
    } finally {
      this.running = false;
    }
  }

  private spin(b: string, ms: number) {
    const { gTop, gBot, gLeafTop, gLeafBot } = this.p;
    gTop.textContent = b;
    gBot.textContent = b;
    gLeafTop.textContent = b;
    gLeafBot.textContent = b;
    return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
  }

  private async step(a: string, b: string, ms: number) {
    const { gTop, gBot, gLeafTop, gLeafBot, leafTop, leafBot } = this.p;
    gTop.textContent = b;
    gBot.textContent = a;
    gLeafTop.textContent = a;
    gLeafBot.textContent = b;
    const half = ms / 2;

    // 2D scale instead of a 3D hinge: at this speed the eye reads the same fall,
    // and the compositor never builds a 3D context per cell
    const fall = leafTop.animate(
      [{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }],
      { duration: half, easing: FALL, fill: "forwards" },
    );
    this.anims.push(fall);
    try {
      await fall.finished;
    } catch {
      return;
    }
    if (this.cancelled) return;

    const land = leafBot.animate(
      [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }],
      { duration: half, easing: LAND, fill: "forwards" },
    );
    this.anims.push(land);
    try {
      await land.finished;
    } catch {
      return;
    }
    if (this.cancelled) return;

    gBot.textContent = b;
    gLeafTop.textContent = b;
    this.stopAnims();
  }
}

/** Small deterministic PRNG so cascades look organic but repeat per cell. */
export function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function padTo(text: string, length: number, align: "left" | "right" = "left") {
  const t = text.toUpperCase().slice(0, length);
  return align === "left" ? t.padEnd(length, " ") : t.padStart(length, " ");
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
