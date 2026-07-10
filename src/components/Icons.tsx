// Crafted line icons (1.75 stroke) — replaces emoji so the site reads bespoke,
// not template. All inherit currentColor and a common stroke style.

type P = { className?: string; size?: number };
const base = (size: number) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
});

export const IconCar = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}><path d="M5 11l1.5-4.2A2 2 0 0 1 8.4 5.5h7.2a2 2 0 0 1 1.9 1.3L19 11" /><path d="M3 16v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-1" /><path d="M6 17H5a1 1 0 0 1-1-1" /><circle cx="7.5" cy="16.5" r="1.6" /><circle cx="16.5" cy="16.5" r="1.6" /></svg>
);
export const IconPin = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const IconShield = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" /><path d="M9.2 12l1.9 1.9 3.7-3.8" /></svg>
);
export const IconChat = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H6a2 2 0 0 1-2-2Z" /></svg>
);
export const IconCalendar = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></svg>
);
export const IconCheck = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}><path d="M20 6L9 17l-5-5" /></svg>
);
export const IconKey = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="8" cy="8" r="4" /><path d="M11 11l8 8M17 15l2-2M15 19l2-2" /></svg>
);
export const IconTag = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 4h7l9 9-7 7-9-9V4Z" /><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none" /></svg>
);
export const IconGlobe = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M3.5 12h17M12 3c2.6 2.4 3.9 5.6 3.9 9s-1.3 6.6-3.9 9c-2.6-2.4-3.9-5.6-3.9-9s1.3-6.6 3.9-9Z" /></svg>
);
export const IconArrow = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconMenu = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconClose = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const Stars = ({ n = 5, className }: { n?: number; className?: string }) => (
  <span className={className} aria-label={`${n} out of 5 stars`}>
    {Array.from({ length: n }).map((_, i) => (
      <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 1 }}>
        <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.1 20.9l1.1-6.5L2.5 9.8l6.5-.9L12 2.5Z" />
      </svg>
    ))}
  </span>
);
