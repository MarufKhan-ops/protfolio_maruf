import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section page-top">
      <div className="container" style={{ textAlign: "center" }}>
        <p className="mono eyebrow">404</p>
        <h1 className="page-title">Page not found</h1>
        <p className="muted">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: "1.5rem", display: "inline-block" }}>
          Back to home
        </Link>
      </div>
    </section>
  );
}
