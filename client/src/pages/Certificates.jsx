import { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import CertificateCard from "../components/CertificateCard.jsx";
import Lightbox from "../components/Lightbox.jsx";

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  useEffect(() => {
    api.get("/certificates")
      .then((res) => setCerts(res.data))
      .catch(() => setError("Could not load certificates. Is the API server running?"))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(certs.map((c) => c.category)))],
    [certs]
  );

  const visible = certs.filter((c) => {
    const inCategory = filter === "All" || c.category === filter;
    const q = query.trim().toLowerCase();
    const inSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.issuer.toLowerCase().includes(q) ||
      (c.issueDate || "").toLowerCase().includes(q);
    return inCategory && inSearch;
  });

  return (
    <section className="section page-top">
      <div className="container">
        <p className="eyebrow mono">Credential registry</p>
        <h1 className="page-title">Certificates & Recognitions</h1>
        <p className="muted page-lede">
          Every entry below is stored in the database and managed from the admin panel — courses,
          national certifications, IEEE service and volunteering records.
        </p>

        {loading && <p className="mono muted">Loading registry…</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && (
          <>
            <div className="registry-controls">
              <input
                className="search-input"
                type="search"
                placeholder="Search title, issuer or year…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search certificates"
              />
              <div className="filter-row">
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`chip mono ${filter === c ? "chip-active" : ""}`}
                    onClick={() => setFilter(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <p className="mono muted registry-count">{visible.length} of {certs.length} credentials</p>
            {visible.length === 0 ? (
              <p className="muted">No certificates match this search.</p>
            ) : (
              <div className="cert-grid">
                {visible.map((cert) => (
                  <CertificateCard key={cert._id} cert={cert} index={certs.indexOf(cert)} onOpen={setActive} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Lightbox cert={active} onClose={() => setActive(null)} />
    </section>
  );
}
