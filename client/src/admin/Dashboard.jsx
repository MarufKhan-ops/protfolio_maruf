import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, auth } from "../api.js";

const CATEGORIES = ["Course", "Training", "Certification", "IEEE", "Volunteering", "Appreciation", "Membership", "Other"];
const emptyCert = { title: "", issuer: "", category: "Other", issueDate: "", credentialId: "", description: "" };
const emptyProject = { title: "", period: "", description: "", tags: "", link: "" };

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("certificates");
  const [stats, setStats] = useState({ certificates: 0, projects: 0, messages: 0, unread: 0 });
  const [certs, setCerts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);

  const [certForm, setCertForm] = useState(emptyCert);
  const [certImage, setCertImage] = useState(null);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [editing, setEditing] = useState(null); // { type: "cert"|"project", data }

  const [notice, setNotice] = useState({ ok: "", error: "" });
  const [busy, setBusy] = useState(false);

  const flash = (ok) => {
    setNotice({ ok, error: "" });
    setTimeout(() => setNotice((n) => ({ ...n, ok: "" })), 3000);
  };
  const fail = (err, fallback) => {
    setNotice({ ok: "", error: err.response?.data?.message || fallback });
    if (err.response?.status === 401) {
      auth.logout();
      navigate("/admin/login");
    }
  };

  const load = () => {
    api.get("/stats").then((r) => setStats(r.data)).catch(() => {});
    api.get("/certificates").then((r) => setCerts(r.data)).catch(() => {});
    api.get("/projects").then((r) => setProjects(r.data)).catch(() => {});
    api.get("/messages").then((r) => setMessages(r.data)).catch(() => {});
  };
  useEffect(load, []);

  const logout = () => {
    auth.logout();
    navigate("/");
  };

  /* ── certificates ─────────────────────── */
  const addCertificate = async () => {
    if (!certForm.title || !certForm.issuer) return setNotice({ ok: "", error: "Title and issuer are required." });
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(certForm).forEach(([k, v]) => fd.append(k, v));
      if (certImage) fd.append("image", certImage);
      await api.post("/certificates", fd);
      setCertForm(emptyCert);
      setCertImage(null);
      const input = document.getElementById("cert-image-input");
      if (input) input.value = "";
      flash("Certificate added.");
      load();
    } catch (err) {
      fail(err, "Could not add certificate.");
    } finally {
      setBusy(false);
    }
  };

  const deleteCertificate = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/certificates/${id}`);
      flash("Certificate deleted.");
      load();
    } catch (err) {
      fail(err, "Could not delete certificate.");
    }
  };

  /* ── projects ─────────────────────────── */
  const addProject = async () => {
    if (!projectForm.title) return setNotice({ ok: "", error: "Project title is required." });
    setBusy(true);
    try {
      await api.post("/projects", projectForm);
      setProjectForm(emptyProject);
      flash("Project added.");
      load();
    } catch (err) {
      fail(err, "Could not add project.");
    } finally {
      setBusy(false);
    }
  };

  const deleteProject = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/projects/${id}`);
      flash("Project deleted.");
      load();
    } catch (err) {
      fail(err, "Could not delete project.");
    }
  };

  /* ── messages ─────────────────────────── */
  const toggleRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      load();
    } catch (err) {
      fail(err, "Could not update message.");
    }
  };
  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages/${id}`);
      flash("Message deleted.");
      load();
    } catch (err) {
      fail(err, "Could not delete message.");
    }
  };

  /* ── edit modal save ──────────────────── */
  const saveEdit = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      if (editing.type === "cert") {
        const d = editing.data;
        const fd = new FormData();
        ["title", "issuer", "category", "issueDate", "credentialId", "description"].forEach((k) => fd.append(k, d[k] || ""));
        if (editing.newImage) fd.append("image", editing.newImage);
        await api.put(`/certificates/${d._id}`, fd);
      } else {
        const d = editing.data;
        await api.put(`/projects/${d._id}`, {
          title: d.title, period: d.period, description: d.description,
          link: d.link, tags: typeof d.tags === "string" ? d.tags : d.tags.join(", ")
        });
      }
      setEditing(null);
      flash("Changes saved.");
      load();
    } catch (err) {
      fail(err, "Could not save changes.");
    } finally {
      setBusy(false);
    }
  };

  const setEditField = (field, value) =>
    setEditing((e) => ({ ...e, data: { ...e.data, [field]: value } }));

  return (
    <section className="section page-top">
      <div className="container">
        <div className="admin-head">
          <div>
            <p className="eyebrow mono">Admin panel</p>
            <h1 className="page-title">Content manager</h1>
          </div>
          <button className="btn btn-ghost" onClick={logout}>Log out</button>
        </div>

        {/* stats overview */}
        <div className="stat-grid">
          <div className="stat-card"><span className="stat-num">{stats.certificates}</span><span className="mono muted">Certificates</span></div>
          <div className="stat-card"><span className="stat-num">{stats.projects}</span><span className="mono muted">Projects</span></div>
          <div className="stat-card"><span className="stat-num">{stats.messages}</span><span className="mono muted">Messages</span></div>
          <div className="stat-card"><span className="stat-num accent">{stats.unread}</span><span className="mono muted">Unread</span></div>
        </div>

        <div className="tab-row">
          <button className={`chip mono ${tab === "certificates" ? "chip-active" : ""}`} onClick={() => setTab("certificates")}>
            Certificates ({certs.length})
          </button>
          <button className={`chip mono ${tab === "projects" ? "chip-active" : ""}`} onClick={() => setTab("projects")}>
            Projects ({projects.length})
          </button>
          <button className={`chip mono ${tab === "messages" ? "chip-active" : ""}`} onClick={() => setTab("messages")}>
            Messages ({stats.unread > 0 ? `${stats.unread} new` : messages.length})
          </button>
        </div>

        {notice.ok && <p className="ok-text mono">{notice.ok}</p>}
        {notice.error && <p className="error-text">{notice.error}</p>}

        {/* ── CERTIFICATES TAB ── */}
        {tab === "certificates" && (
          <div className="admin-grid">
            <div className="card form-card">
              <h3>Add a certificate</h3>
              <label>Title *
                <input value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} placeholder="e.g. AWS Cloud Practitioner" />
              </label>
              <label>Issuer *
                <input value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} placeholder="e.g. Amazon Web Services" />
              </label>
              <div className="form-row">
                <label>Category
                  <select value={certForm.category} onChange={(e) => setCertForm({ ...certForm, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label>Issue date
                  <input value={certForm.issueDate} onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })} placeholder="e.g. March 2026" />
                </label>
              </div>
              <label>Credential ID
                <input value={certForm.credentialId} onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })} placeholder="optional" />
              </label>
              <label>Description
                <textarea rows="3" value={certForm.description} onChange={(e) => setCertForm({ ...certForm, description: e.target.value })} placeholder="One or two lines about this credential" />
              </label>
              <label>Certificate image (JPG / PNG / WebP)
                <input id="cert-image-input" type="file" accept="image/*" onChange={(e) => setCertImage(e.target.files[0] || null)} />
              </label>
              <button className="btn btn-primary" onClick={addCertificate} disabled={busy}>
                {busy ? "Saving…" : "Add certificate"}
              </button>
            </div>

            <div className="admin-list">
              <h3>Existing certificates</h3>
              {certs.map((c) => (
                <div className="admin-item" key={c._id}>
                  {c.image ? <img src={c.image} alt="" /> : <div className="admin-thumb-empty mono">—</div>}
                  <div className="admin-item-body">
                    <strong>{c.title}</strong>
                    <span className="muted mono">{c.category} · {c.issuer}{c.issueDate ? ` · ${c.issueDate}` : ""}</span>
                  </div>
                  <div className="admin-actions">
                    <button className="btn-mini" onClick={() => setEditing({ type: "cert", data: { ...c } })}>Edit</button>
                    <button className="btn-danger" onClick={() => deleteCertificate(c._id, c.title)}>Delete</button>
                  </div>
                </div>
              ))}
              {certs.length === 0 && <p className="muted">No certificates yet — add your first one.</p>}
            </div>
          </div>
        )}

        {/* ── PROJECTS TAB ── */}
        {tab === "projects" && (
          <div className="admin-grid">
            <div className="card form-card">
              <h3>Add a project</h3>
              <label>Title *
                <input value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="Project name" />
              </label>
              <label>Period
                <input value={projectForm.period} onChange={(e) => setProjectForm({ ...projectForm, period: e.target.value })} placeholder="e.g. Jan – Apr 2026" />
              </label>
              <label>Description
                <textarea rows="3" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="What it does and what you built" />
              </label>
              <label>Tags (comma separated)
                <input value={projectForm.tags} onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })} placeholder="React, MongoDB, IoT" />
              </label>
              <label>Link
                <input value={projectForm.link} onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })} placeholder="https://github.com/…" />
              </label>
              <button className="btn btn-primary" onClick={addProject} disabled={busy}>
                {busy ? "Saving…" : "Add project"}
              </button>
            </div>

            <div className="admin-list">
              <h3>Existing projects</h3>
              {projects.map((p) => (
                <div className="admin-item" key={p._id}>
                  <div className="admin-item-body">
                    <strong>{p.title}</strong>
                    <span className="muted mono">{p.period || "—"}{p.tags?.length ? ` · ${p.tags.join(", ")}` : ""}</span>
                  </div>
                  <div className="admin-actions">
                    <button className="btn-mini" onClick={() => setEditing({ type: "project", data: { ...p, tags: p.tags.join(", ") } })}>Edit</button>
                    <button className="btn-danger" onClick={() => deleteProject(p._id, p.title)}>Delete</button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="muted">No projects yet — add your first one.</p>}
            </div>
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
        {tab === "messages" && (
          <div className="message-list">
            {messages.length === 0 && <p className="muted">No messages yet. When someone uses the contact form, it appears here.</p>}
            {messages.map((m) => (
              <article className={`message-item ${m.read ? "" : "message-unread"}`} key={m._id}>
                <div className="message-head">
                  <div>
                    <strong>{m.name}</strong>{" "}
                    <a className="mono" href={`mailto:${m.email}`}>{m.email}</a>
                    {m.subject && <span className="muted"> — {m.subject}</span>}
                  </div>
                  <span className="mono muted">{new Date(m.createdAt).toLocaleString()}</span>
                </div>
                <p>{m.body}</p>
                <div className="admin-actions">
                  <button className="btn-mini" onClick={() => toggleRead(m._id)}>
                    {m.read ? "Mark unread" : "Mark read"}
                  </button>
                  <a className="btn-mini" href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "your message")}`}>Reply</a>
                  <button className="btn-danger" onClick={() => deleteMessage(m._id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ── EDIT MODAL ── */}
      {editing && (
        <div className="lightbox" onClick={() => setEditing(null)} role="dialog" aria-modal="true">
          <div className="lightbox-panel edit-panel" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setEditing(null)} aria-label="Close editor">✕</button>
            <div className="form-card">
              <h3>Edit {editing.type === "cert" ? "certificate" : "project"}</h3>
              <label>Title
                <input value={editing.data.title} onChange={(e) => setEditField("title", e.target.value)} />
              </label>
              {editing.type === "cert" ? (
                <>
                  <label>Issuer
                    <input value={editing.data.issuer} onChange={(e) => setEditField("issuer", e.target.value)} />
                  </label>
                  <div className="form-row">
                    <label>Category
                      <select value={editing.data.category} onChange={(e) => setEditField("category", e.target.value)}>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </label>
                    <label>Issue date
                      <input value={editing.data.issueDate || ""} onChange={(e) => setEditField("issueDate", e.target.value)} />
                    </label>
                  </div>
                  <label>Credential ID
                    <input value={editing.data.credentialId || ""} onChange={(e) => setEditField("credentialId", e.target.value)} />
                  </label>
                  <label>Description
                    <textarea rows="3" value={editing.data.description || ""} onChange={(e) => setEditField("description", e.target.value)} />
                  </label>
                  <label>Replace image (optional)
                    <input type="file" accept="image/*" onChange={(e) => setEditing((ed) => ({ ...ed, newImage: e.target.files[0] || null }))} />
                  </label>
                </>
              ) : (
                <>
                  <label>Period
                    <input value={editing.data.period || ""} onChange={(e) => setEditField("period", e.target.value)} />
                  </label>
                  <label>Description
                    <textarea rows="3" value={editing.data.description || ""} onChange={(e) => setEditField("description", e.target.value)} />
                  </label>
                  <label>Tags (comma separated)
                    <input value={editing.data.tags || ""} onChange={(e) => setEditField("tags", e.target.value)} />
                  </label>
                  <label>Link
                    <input value={editing.data.link || ""} onChange={(e) => setEditField("link", e.target.value)} />
                  </label>
                </>
              )}
              <button className="btn btn-primary" onClick={saveEdit} disabled={busy}>
                {busy ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
