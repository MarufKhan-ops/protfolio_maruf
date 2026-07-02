import { useEffect } from "react";

export default function Lightbox({ cert, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!cert) return null;
  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-panel" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close viewer">✕</button>
        {cert.image && <img src={cert.image} alt={cert.title} />}
        <div className="lightbox-info">
          <h3>{cert.title}</h3>
          <p>{cert.issuer}{cert.issueDate ? ` · ${cert.issueDate}` : ""}</p>
          {cert.credentialId && <p className="mono">Credential ID: {cert.credentialId}</p>}
          {cert.description && <p className="muted">{cert.description}</p>}
        </div>
      </div>
    </div>
  );
}
