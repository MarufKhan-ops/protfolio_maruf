import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { profile } from "../data/profile.js";
import { useReveal } from "../hooks/useReveal.js";

const services = [
  {
    title: "Full-Stack Web Apps",
    desc: "End-to-end MERN applications — REST APIs, auth flows, payment integration and responsive interfaces.",
    mono: "React · Node · Express · MongoDB"
  },
  {
    title: "Creative & Brand Design",
    desc: "Logos, illustrations, event branding and campus campaigns built in Adobe Illustrator.",
    mono: "Illustrator · Logo · Print"
  },
  {
    title: "Security & ML Research",
    desc: "Applied research on intrusion detection, malicious URL classification and clinical prediction models.",
    mono: "Deep Learning · Cybersecurity"
  },
  {
    title: "Community & Events",
    desc: "Leading IEEE BUBT SB — organizing contests, workshops and volunteer programs for hundreds of students.",
    mono: "IEEE · BIUCPC · ICPC"
  }
];

export default function Home() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [stats, setStats] = useState({ certificates: 0, projects: 0 });
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [formState, setFormState] = useState({ busy: false, ok: "", error: "" });

  useReveal();

  useEffect(() => {
    const t = setInterval(() => setRoleIndex((i) => (i + 1) % profile.roles.length), 2600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    api.get("/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const sendMessage = async () => {
    if (!form.name || !form.email || !form.body) {
      return setFormState({ busy: false, ok: "", error: "Name, email and message are required." });
    }
    setFormState({ busy: true, ok: "", error: "" });
    try {
      await api.post("/messages", form);
      setForm({ name: "", email: "", subject: "", body: "" });
      setFormState({ busy: false, ok: "Message sent — I'll get back to you soon.", error: "" });
    } catch (err) {
      setFormState({
        busy: false, ok: "",
        error: err.response?.data?.message || "Could not send the message. Please try again."
      });
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <p className="eyebrow mono">Dhaka, Bangladesh · CSE @ BUBT</p>
            <h1>{profile.shortName}</h1>
            <p className="hero-role" aria-live="polite">
              <span key={roleIndex} className="role-flip">{profile.roles[roleIndex]}</span>
            </p>
            <p className="hero-summary">{profile.summary}</p>
            <div className="hero-actions">
              <Link to="/certificates" className="btn btn-primary">View credential registry</Link>
              <a href="/uploads/cv/Istiyak_Hasan_Maruf_CV.pdf" className="btn btn-ghost" download>
                Download CV ↓
              </a>
            </div>
            <div className="hero-socials mono">
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href={profile.socials.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={profile.socials.facebook} target="_blank" rel="noreferrer">Facebook ↗</a>
            </div>
          </div>
          <div className="hero-photo-wrap">
            <div className="hero-photo">
              <img src={profile.photo} alt={profile.shortName} onError={(e) => (e.target.style.display = "none")} />
            </div>
            <div className="hero-ledger mono">
              <span>{stats.certificates} verified credentials</span>
              <span>{stats.projects} projects & research works</span>
              <span>3 IEEE leadership roles</span>
              <span>2 publications (2026)</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT I DO */}
      <section className="section">
        <div className="container">
          <h2 className="section-title reveal"><span className="mono section-no">§ 01</span> What I do</h2>
          <div className="service-grid">
            {services.map((s) => (
              <div className="service-card reveal" key={s.title}>
                <h3>{s.title}</h3>
                <p className="muted">{s.desc}</p>
                <span className="mono service-mono">{s.mono}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title reveal"><span className="mono section-no">§ 02</span> Skills</h2>
          <div className="skill-grid">
            {profile.skills.map((s) => (
              <div className="skill-card reveal" key={s.name}>
                <div className="skill-head">
                  <h3>{s.name}</h3>
                  <span className="skill-dots" aria-label={`Level ${s.level} of 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <i key={n} className={n <= s.level ? "on" : ""} />
                    ))}
                  </span>
                </div>
                <p className="muted">{s.note}</p>
              </div>
            ))}
          </div>
          <p className="lang-strip mono reveal">Languages — {profile.languages.join(" · ")}</p>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="section">
        <div className="container">
          <h2 className="section-title reveal"><span className="mono section-no">§ 03</span> Education</h2>
          <div className="timeline">
            {profile.education.map((e) => (
              <div className="timeline-item reveal" key={e.school}>
                <span className="timeline-period mono">{e.period}</span>
                <div>
                  <h3>{e.link ? <a href={e.link} target="_blank" rel="noreferrer">{e.school}</a> : e.school}</h3>
                  <p>{e.degree}</p>
                  <p className="muted mono">{e.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title reveal"><span className="mono section-no">§ 04</span> Leadership & Volunteering</h2>
          <ul className="lead-list">
            {profile.leadership.map((l) => (
              <li className="reveal" key={l.role + l.org}>
                <strong>{l.role}</strong> — {l.org}
                <span className="mono muted"> · {l.period}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PUBLICATIONS */}
      <section className="section">
        <div className="container">
          <h2 className="section-title reveal"><span className="mono section-no">§ 05</span> Publications</h2>
          <div className="pub-list">
            {profile.publications.map((p) => (
              <article className="pub-item reveal" key={p.title}>
                <h3>{p.title}</h3>
                <p className="muted mono">{p.venue}{p.year ? ` · ${p.year}` : ""}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact" id="contact">
        <div className="container contact-grid">
          <div className="contact-copy">
            <h2>Let's build something.</h2>
            <p>Open to internships, junior roles and collaborative research in IT & telecommunication. Drop a message — it lands straight in my dashboard.</p>
            <div className="contact-list mono">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span>{profile.phone}</span>
              <span>{profile.location}</span>
            </div>
          </div>
          <div className="contact-form">
            <div className="form-row">
              <label>Name *
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              </label>
              <label>Email *
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </label>
            </div>
            <label>Subject
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" />
            </label>
            <label>Message *
              <textarea rows="4" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Tell me about your project or opportunity" />
            </label>
            {formState.error && <p className="error-text">{formState.error}</p>}
            {formState.ok && <p className="ok-text">{formState.ok}</p>}
            <button className="btn btn-primary" onClick={sendMessage} disabled={formState.busy}>
              {formState.busy ? "Sending…" : "Send message"}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
