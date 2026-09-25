export function Lamp({
  lit = false,
  className = "",
  size,
  label,
}: {
  lit?: boolean;
  className?: string;
  /** CSS length, e.g. "0.5rem" */
  size?: string;
  /** accessible status text; omit when the lamp is decorative */
  label?: string;
}) {
  return (
    <span
      className={`lamp ${className}`}
      data-lit={lit ? "true" : "false"}
      style={size ? ({ "--lamp": size } as React.CSSProperties) : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
