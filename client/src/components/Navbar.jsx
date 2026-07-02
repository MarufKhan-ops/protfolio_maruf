import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme.js";

const links = [
  { to: "/", label: "Home" },
  { to: "/certificates", label: "Certificates" },
  { to: "/projects", label: "Projects" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">IHM</span>
          <span className="brand-text">Istiyak Hasan Maruf</span>
        </Link>
        <div className="nav-right">
          <button className="theme-toggle" onClick={toggle}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
          <nav className={`nav-links ${open ? "open" : ""}`}>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            <a href="/#contact" onClick={() => setOpen(false)}>Contact</a>
            <NavLink to="/admin" className="nav-admin" onClick={() => setOpen(false)}>Admin</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
