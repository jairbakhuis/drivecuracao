// Brand marks and custom SVG scenery — no external images, all vector so it
// stays crisp and light. Palette matches src/styles.css tokens.

export function LogoMark({ className = "mark" }: { className?: string }) {
  // A sun over stylized waves — sums up "sunny island driving".
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="13" r="7" fill="var(--gold)" />
      <g stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M16 2v2.4M16 21.6V24M4.5 13H7M25 13h2.5M8 5l1.6 1.6M22.4 6.6L24 5M8 21l1.6-1.6M22.4 19.4L24 21" />
      </g>
      <path d="M2 24c3 0 3 2 6 2s3-2 6-2 3 2 6 2 3-2 6-2 3 2 6 2" stroke="var(--teal)" strokeWidth="2.1" strokeLinecap="round" fill="none" />
      <path d="M2 28.5c3 0 3 1.6 6 1.6s3-1.6 6-1.6 3 1.6 6 1.6 3-1.6 6-1.6" stroke="var(--teal-soft)" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
    </svg>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`wordmark${light ? " light" : ""}`}>
      <LogoMark />
      drive<b>curaçao</b>
    </span>
  );
}

/** Full-bleed hero scenery: sky, sun, hills, layered turquoise sea, palms. */
export function HeroScene() {
  return (
    <div className="hero-scene" aria-hidden="true">
      <svg viewBox="0 0 1440 620" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a6076" />
            <stop offset="0.55" stopColor="#0d7f8a" />
            <stop offset="1" stopColor="#12a99b" />
          </linearGradient>
          <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffe08a" />
            <stop offset="0.5" stopColor="#ffc63f" />
            <stop offset="1" stopColor="#ffc63f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sea1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#16bfae" />
            <stop offset="1" stopColor="#0fb3a6" />
          </linearGradient>
          <linearGradient id="sea2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0fb3a6" />
            <stop offset="1" stopColor="#0a8f88" />
          </linearGradient>
        </defs>

        <rect width="1440" height="620" fill="url(#sky)" />
        {/* sun glow */}
        <circle cx="1150" cy="150" r="230" fill="url(#sun)" opacity="0.9" />
        <circle cx="1150" cy="150" r="66" fill="#ffd76b" />

        {/* soft clouds */}
        <g fill="#ffffff" opacity="0.16">
          <ellipse cx="300" cy="120" rx="120" ry="26" />
          <ellipse cx="420" cy="140" rx="90" ry="20" />
          <ellipse cx="900" cy="90" rx="100" ry="22" />
        </g>

        {/* distant hills */}
        <path d="M0 300 Q 250 250 520 296 T 1040 288 T 1440 300 V620 H0 Z" fill="#0b6f78" opacity="0.55" />
        <path d="M0 340 Q 360 300 720 344 T 1440 336 V620 H0 Z" fill="#0a636f" opacity="0.5" />

        {/* sea layers */}
        <path d="M0 380 Q 360 356 720 382 T 1440 378 V620 H0 Z" fill="url(#sea1)" />
        <path d="M0 452 Q 300 430 620 452 T 1200 450 T 1440 452 V620 H0 Z" fill="url(#sea2)" />
        {/* highlights */}
        <g stroke="#bff3ec" strokeWidth="3" strokeLinecap="round" opacity="0.5" fill="none">
          <path d="M120 500 q 40 -10 80 0" />
          <path d="M420 540 q 40 -10 80 0" />
          <path d="M820 512 q 40 -10 80 0" />
          <path d="M1080 552 q 40 -10 80 0" />
        </g>

        {/* palm silhouettes, left */}
        <g fill="#063b3a" opacity="0.9">
          <rect x="86" y="300" width="10" height="150" rx="5" transform="rotate(-4 91 375)" />
          <g transform="translate(91 300)">
            <path d="M0 0 C -60 -20 -96 4 -110 30 C -70 14 -34 12 0 8 Z" />
            <path d="M0 0 C 60 -20 96 4 110 30 C 70 14 34 12 0 8 Z" />
            <path d="M0 0 C -30 -60 -20 -96 6 -110 C -10 -70 -8 -34 4 0 Z" />
            <path d="M0 0 C 40 -50 78 -50 100 -30 C 62 -34 30 -20 4 2 Z" />
            <path d="M0 0 C -40 -50 -78 -50 -100 -30 C -62 -34 -30 -20 -4 2 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/** Simpler tinted scenery for interior page headers. */
export function PageScene() {
  return (
    <div className="hero-scene" aria-hidden="true">
      <svg viewBox="0 0 1440 360" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="psky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#084a5f" />
            <stop offset="1" stopColor="#0d8f8c" />
          </linearGradient>
          <radialGradient id="psun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffc63f" />
            <stop offset="1" stopColor="#ffc63f" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="360" fill="url(#psky)" />
        <circle cx="1180" cy="60" r="200" fill="url(#psun)" opacity="0.8" />
        <path d="M0 250 Q 360 220 720 252 T 1440 248 V360 H0 Z" fill="#0fb3a6" opacity="0.85" />
        <path d="M0 300 Q 300 280 620 300 T 1440 298 V360 H0 Z" fill="#0a8f88" />
        <g stroke="#bff3ec" strokeWidth="3" strokeLinecap="round" opacity="0.4" fill="none">
          <path d="M180 320 q 40 -10 80 0" /><path d="M620 330 q 40 -10 80 0" /><path d="M1020 322 q 40 -10 80 0" />
        </g>
      </svg>
    </div>
  );
}

/** Illustrated category thumbnail when a tenant supplied no image. */
export function CarIllustration({ variant = 0 }: { variant?: number }) {
  const bodies = ["#0fb3a6", "#ff8a5b", "#ffc63f", "#0a6076", "#ff6f52"];
  const body = bodies[variant % bodies.length];
  return (
    <svg className="cat-illus" viewBox="0 0 320 168" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`cg${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf6f4" />
          <stop offset="1" stopColor="#d7ede9" />
        </linearGradient>
      </defs>
      <rect width="320" height="168" fill={`url(#cg${variant})`} />
      <ellipse cx="160" cy="150" rx="130" ry="14" fill="#0a6076" opacity="0.08" />
      <g transform="translate(58 52)">
        <path d="M8 52 L28 20 Q34 10 48 10 L128 10 Q142 10 152 20 L184 42 L196 44 Q206 46 206 58 L206 70 Q206 78 198 78 L14 78 Q4 78 4 68 L4 62 Q4 54 8 52 Z" fill={body} />
        <path d="M40 24 Q46 16 56 16 L96 16 L96 40 L34 40 Z" fill="#ffffff" opacity="0.85" />
        <path d="M104 16 L124 16 Q134 16 142 24 L156 40 L104 40 Z" fill="#ffffff" opacity="0.85" />
        <circle cx="52" cy="78" r="18" fill="#0b2b33" /><circle cx="52" cy="78" r="8" fill="#e7eef0" />
        <circle cx="162" cy="78" r="18" fill="#0b2b33" /><circle cx="162" cy="78" r="8" fill="#e7eef0" />
      </g>
      <circle cx="270" cy="34" r="20" fill="var(--gold)" opacity="0.9" />
    </svg>
  );
}
