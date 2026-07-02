import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, auth } from "../api.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      auth.login(data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check the API server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section page-top">
      <div className="container login-wrap">
        <p className="eyebrow mono">Admin access</p>
        <h1 className="page-title">Sign in</h1>
        <div className="card form-card">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin email" autoComplete="username"
              onKeyDown={(e) => e.key === "Enter" && submit()} />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="password" autoComplete="current-password"
              onKeyDown={(e) => e.key === "Enter" && submit()} />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" onClick={submit} disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </div>
    </section>
  );
}
