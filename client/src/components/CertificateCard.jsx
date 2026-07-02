export default function CertificateCard({ cert, index, onOpen }) {
  const serial = `CRT-${String(index + 1).padStart(3, "0")}`;
  return (
    <article className="cert-card" onClick={() => onOpen(cert)} tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(cert)}>
      <div className="cert-thumb">
        {cert.image ? (
          <img src={cert.image} alt={cert.title} loading="lazy" />
        ) : (
          <div className="cert-thumb-empty mono">No image</div>
        )}
        <span className="cert-serial mono">{serial}</span>
      </div>
      <div className="cert-body">
        <span className={`cert-tag mono tag-${cert.category?.toLowerCase()}`}>{cert.category}</span>
        <h3>{cert.title}</h3>
        <p className="cert-meta">{cert.issuer}{cert.issueDate ? ` · ${cert.issueDate}` : ""}</p>
      </div>
    </article>
  );
}
