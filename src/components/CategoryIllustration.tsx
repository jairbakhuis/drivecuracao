import { CategoryBucket, categoryBucket } from "../categoryImage";

/**
 * Branded, flat-style silhouette per category TYPE — deliberately illustrated
 * (not a photo) so it's clear the customer is choosing a class of car, "or
 * similar", never one specific vehicle. Distinct shapes per bucket; one
 * on-brand colour each; consistent framing so the grid reads as a set.
 */

const BODY: Record<CategoryBucket, string> = {
  economy: "#17847a",
  compact: "#38b0c9",
  hatchback: "#6b5ca8",
  sedan: "#0e4642",
  suv: "#d9694a",
  pickup: "#c99a3f",
  van: "#2a8c7d",
  luxury: "#0b3a3a",
  convertible: "#e0815f",
};

function Wheels({ x1, x2, r = 16 }: { x1: number; x2: number; r?: number }) {
  return (
    <>
      {[x1, x2].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={140} r={r} fill="#12241d" />
          <circle cx={cx} cy={140} r={r * 0.42} fill="#e8efe9" />
        </g>
      ))}
    </>
  );
}

const WIN = "#eaf5f0";

function Body({ bucket }: { bucket: CategoryBucket }) {
  const b = BODY[bucket];
  switch (bucket) {
    case "suv":
      return (
        <>
          <rect x={104} y={54} width={108} height={5} rx={2.5} fill={b} />
          <path d="M92 100 L100 64 Q102 59 111 59 L205 59 Q214 59 216 64 L224 100 Z" fill={b} />
          <rect x={54} y={96} width={212} height={38} rx={13} fill={b} />
          <path d="M110 96 L116 68 Q117 65 123 65 L152 65 L152 96 Z" fill={WIN} />
          <path d="M160 65 L193 65 Q199 65 202 70 L214 96 L160 96 Z" fill={WIN} />
          <Wheels x1={100} x2={220} r={19} />
        </>
      );
    case "van":
      return (
        <>
          <path d="M60 96 L70 52 Q72 48 82 48 L232 48 Q243 48 246 58 L252 96 Z" fill={b} />
          <rect x={44} y={92} width={232} height={44} rx={13} fill={b} />
          <path d="M78 90 L86 58 Q87 55 93 55 L150 55 L150 90 Z" fill={WIN} />
          <path d="M158 55 L226 55 Q234 55 237 62 L245 90 L158 90 Z" fill={WIN} />
          <Wheels x1={92} x2={236} r={18} />
        </>
      );
    case "pickup":
      return (
        <>
          <path d="M88 100 L96 70 Q98 66 106 66 L150 66 Q158 66 160 72 L166 100 Z" fill={b} />
          <rect x={52} y={100} width={212} height={32} rx={12} fill={b} />
          <rect x={168} y={84} width={94} height={12} rx={4} fill={b} />
          <path d="M104 98 L110 74 Q111 71 117 71 L142 71 Q149 71 151 76 L156 98 Z" fill={WIN} />
          <Wheels x1={100} x2={224} r={18} />
        </>
      );
    case "sedan":
      return (
        <>
          {/* long + low, short centred cabin with a real trunk (3-box) */}
          <path d="M120 105 L134 89 Q138 85 146 85 L182 85 Q189 85 193 89 L206 105 Z" fill={b} />
          <rect x={40} y={104} width={240} height={26} rx={13} fill={b} />
          <path d="M132 102 L141 90 Q143 88 148 88 L162 88 L162 102 Z" fill={WIN} />
          <path d="M168 88 L182 88 Q186 88 189 91 L198 102 L168 102 Z" fill={WIN} />
          <Wheels x1={92} x2={230} />
        </>
      );
    case "luxury":
      return (
        <>
          <path d="M116 104 L132 86 Q136 82 145 82 L196 82 Q205 82 209 87 L224 104 Z" fill={b} />
          <rect x={44} y={102} width={232} height={26} rx={13} fill={b} />
          <rect x={50} y={116} width={220} height={2.5} fill="#caa14a" opacity={0.85} />
          <path d="M130 100 L140 88 Q142 86 147 86 L166 86 L166 100 Z" fill={WIN} />
          <path d="M172 86 L192 86 Q197 86 200 90 L210 100 L172 100 Z" fill={WIN} />
          <Wheels x1={94} x2={230} />
        </>
      );
    case "convertible":
      return (
        <>
          <rect x={54} y={104} width={208} height={28} rx={14} fill={b} />
          <path d="M120 104 L150 104 L138 88 Q136 86 131 86 L128 86 Q122 86 121 92 Z" fill={WIN} />
          <path d="M150 104 L150 90 Q150 86 156 86 L196 86" fill="none" stroke={b} strokeWidth={5} strokeLinecap="round" />
          <Wheels x1={100} x2={216} />
        </>
      );
    default: // economy, compact, hatchback — short, tall greenhouse, sloped hatch rear
      return (
        <>
          <path d="M104 104 L116 78 Q120 72 130 72 L172 72 Q186 73 196 88 L210 104 Z" fill={b} />
          <rect x={70} y={101} width={180} height={31} rx={15} fill={b} />
          <path d="M114 99 L124 82 Q126 80 132 80 L150 80 L150 99 Z" fill={WIN} />
          <path d="M156 80 L172 80 Q182 81 189 91 L197 99 L156 99 Z" fill={WIN} />
          <Wheels x1={106} x2={214} />
        </>
      );
  }
}

export default function CategoryIllustration({ name }: { name: string }) {
  const bucket = categoryBucket(name);
  return (
    <svg className="cat-illus" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${bucket} category`}>
      <defs>
        <linearGradient id={`cbg-${bucket}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef3ef" />
          <stop offset="1" stopColor="#dde9e1" />
        </linearGradient>
      </defs>
      <rect width={320} height={180} fill={`url(#cbg-${bucket})`} />
      <ellipse cx={160} cy={152} rx={122} ry={11} fill="#0b3a3a" opacity={0.08} />
      <Body bucket={bucket} />
    </svg>
  );
}
