// Scrolling ticker bar (Joy-Rush style). The item list is duplicated so the
// CSS translateX(-50%) loop is seamless; pauses on hover.
export default function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {loop.map((t, i) => (
          <span key={i}>
            {t}
            <span className="star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
