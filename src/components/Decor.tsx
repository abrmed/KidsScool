// Formes et emojis qui flottent en arrière-plan (purement décoratifs, ignorés par les lecteurs d'écran).
const ELEMENTS = [
  { e: "📚", c: "left-[6%] top-[8%] text-5xl", d: "0s", r: "-12deg" },
  { e: "✏️", c: "right-[8%] top-[12%] text-4xl", d: "1.2s", r: "18deg" },
  { e: "🧪", c: "left-[10%] bottom-[14%] text-4xl", d: "2.1s", r: "10deg" },
  { e: "⭐", c: "right-[12%] bottom-[20%] text-5xl", d: "0.6s", r: "-8deg" },
  { e: "🚀", c: "right-[30%] top-[4%] text-3xl hidden sm:block", d: "1.8s", r: "25deg" },
  { e: "🎯", c: "left-[28%] bottom-[5%] text-3xl hidden sm:block", d: "2.6s", r: "-15deg" },
];

export function Decor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-400/40 blur-3xl" />
      <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-cyan-300/40 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-amber-300/40 blur-3xl" />
      {ELEMENTS.map((x) => (
        <span
          key={x.e}
          className={`absolute animate-flotter select-none drop-shadow-lg ${x.c}`}
          style={{ animationDelay: x.d, ["--rotation" as string]: x.r }}
        >
          {x.e}
        </span>
      ))}
    </div>
  );
}
