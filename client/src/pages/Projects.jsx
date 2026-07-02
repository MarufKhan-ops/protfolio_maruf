import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/projects")
      .then((res) => setProjects(res.data))
      .catch(() => setError("Could not load projects. Is the API server running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section page-top">
      <div className="container">
        <p className="eyebrow mono">Selected work</p>
        <h1 className="page-title">Projects & Research</h1>
        <p className="muted page-lede">Full-stack builds, IoT prototypes and ongoing security research.</p>

        {loading && <p className="mono muted">Loading projects…</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="project-grid">
          {projects.map((p) => (
            <article className="project-card" key={p._id}>
              <div className="project-head">
                <h3>{p.title}</h3>
                {p.period && <span className="mono muted">{p.period}</span>}
              </div>
              {p.description && <p>{p.description}</p>}
              {p.tags?.length > 0 && (
                <div className="tag-row">
                  {p.tags.map((t) => <span key={t} className="chip mono chip-static">{t}</span>)}
                </div>
              )}
              {p.link && (
                <a className="mono project-link" href={p.link} target="_blank" rel="noreferrer">
                  View repository ↗
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
