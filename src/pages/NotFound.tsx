import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { IconPin } from "../components/Icons";

export default function NotFound() {
  return (
    <Layout>
      <section className="section" style={{ textAlign: "center", paddingTop: 140 }}>
        <div className="container">
          <div style={{ color: "var(--teal)", display: "flex", justifyContent: "center" }}><IconPin size={54} /></div>
          <h1 style={{ fontSize: 40, marginTop: 14 }}>Lost on the island</h1>
          <p style={{ color: "var(--muted)", fontSize: 18, margin: "12px 0 26px" }}>
            We couldn't find that page — but we can find you a car.
          </p>
          <Link className="btn btn-coral btn-lg" to="/">Back to home</Link>
        </div>
      </section>
    </Layout>
  );
}
