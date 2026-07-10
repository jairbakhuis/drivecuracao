import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Wordmark } from "./Brand";

const WHATSAPP = "https://wa.me/59995262538?text=Hi%2C%20I%27m%20interested%20in%20renting%20a%20car%20in%20Cura%C3%A7ao";

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

/** Reveal children on scroll (adds .in to .reveal elements). */
export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal");
    if (!els?.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

export default function Layout({ children, onHero = false }: { children: React.ReactNode; onHero?: boolean }) {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setMenuOpen(false); window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      <nav className={`nav${scrolled ? " scrolled" : ""}${onHero ? " on-hero" : " scrolled"}`}>
        <div className="container nav-inner">
          <Link to="/" aria-label="Drive Curaçao home"><Wordmark /></Link>
          <div className={`nav-links${menuOpen ? " open" : ""}`}>
            <NavLink to="/cars">Browse cars</NavLink>
            <NavLink to="/how-it-works">How it works</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/faq">FAQ</NavLink>
            <a className="btn btn-coral nav-cta" href={WHATSAPP} target="_blank" rel="noreferrer">Get help</a>
          </div>
          <button
            className="nav-mobile-toggle"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>
      <main>{children}</main>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Wordmark light />
            <p>
              The easy way to rent a car in Curaçao. One place to compare and book from trusted local
              rental companies — transparent prices, pay at pickup.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link to="/cars">Browse cars</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/about">About us</Link>
            <Link to="/faq">FAQ</Link>
          </div>
          <div>
            <h4>Categories</h4>
            <Link to="/cars">Economy</Link>
            <Link to="/cars">Compact</Link>
            <Link to="/cars">SUV</Link>
            <Link to="/cars">Automatic</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp us</a>
            <a href="mailto:hello@drivecuracao.com">hello@drivecuracao.com</a>
            <span style={{ display: "block", padding: "5px 0", fontSize: 14.5, opacity: 0.72 }}>Willemstad, Curaçao</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Drive Curaçao. All cars provided by licensed local rental companies.</span>
          <span>Made in Curaçao</span>
        </div>
      </div>
    </footer>
  );
}

export { WHATSAPP };
