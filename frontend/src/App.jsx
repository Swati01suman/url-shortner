import { useState } from "react";

const API = "http://localhost:8000";

export default function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const shorten = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setResult(data);
      setHistory((prev) => [data, ...prev].slice(0, 10));
      setUrl("");
    } catch (e) {
      setError("Could not connect to backend!");
    }
    setLoading(false);
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #141414;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          min-height: 100vh;
        }

        .bg-grid {
          position: fixed;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 4px;
          opacity: 0.35;
          z-index: 0;
        }

        .bg-grid-item {
          background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
          position: relative;
          overflow: hidden;
        }

        .bg-grid-item::after {
          content: '🔗';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2.5rem;
          opacity: 0.3;
        }

        .bg-grid-item:nth-child(2n)::after { content: '🌐'; }
        .bg-grid-item:nth-child(3n)::after { content: '⚡'; }
        .bg-grid-item:nth-child(4n)::after { content: '🚀'; }
        .bg-grid-item:nth-child(5n)::after { content: '💡'; }

        .overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(20,20,20,0.7) 0%,
            rgba(20,20,20,0.4) 40%,
            rgba(20,20,20,0.85) 80%,
            rgba(20,20,20,1) 100%
          );
          z-index: 1;
        }

        .navbar {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          background: linear-gradient(to bottom, rgba(20,20,20,0.9), transparent);
        }

        .logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          color: #e50914;
          letter-spacing: 2px;
        }

        .logo span { color: #fff; }

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 20px;
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem, 8vw, 6rem);
          letter-spacing: 3px;
          line-height: 1;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #fff 0%, #e50914 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.4rem);
          color: #e5e5e5;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .hero-sub2 {
          font-size: 1rem;
          color: #a3a3a3;
          margin-bottom: 32px;
        }

        .input-area {
          display: flex;
          width: 100%;
          max-width: 680px;
          margin-bottom: 16px;
          box-shadow: 0 0 40px rgba(229,9,20,0.3);
          border-radius: 4px;
          overflow: hidden;
        }

        .url-input {
          flex: 1;
          padding: 18px 20px;
          background: rgba(255,255,255,0.08);
          border: 2px solid rgba(255,255,255,0.15);
          border-right: none;
          color: #fff;
          font-size: 1rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          backdrop-filter: blur(10px);
          transition: border-color 0.2s;
        }

        .url-input::placeholder { color: #a3a3a3; }
        .url-input:focus { border-color: #e50914; }

        .shorten-btn {
          padding: 18px 32px;
          background: #e50914;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          border: none;
          cursor: pointer;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .shorten-btn:hover { background: #f40612; }
        .shorten-btn:disabled { background: #666; cursor: not-allowed; }

        .error-msg { color: #fb8c00; font-size: 0.9rem; margin-bottom: 12px; }

        .result-card {
          width: 100%;
          max-width: 680px;
          background: rgba(20,20,20,0.85);
          border: 1px solid rgba(229,9,20,0.5);
          border-radius: 4px;
          padding: 20px 24px;
          margin-bottom: 16px;
          backdrop-filter: blur(10px);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .result-label {
          font-size: 0.7rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #a3a3a3;
          margin-bottom: 8px;
        }

        .result-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .result-url {
          color: #46d369;
          font-size: 1.1rem;
          font-weight: 700;
          text-decoration: none;
          word-break: break-all;
        }

        .result-url:hover { text-decoration: underline; }

        .copy-btn {
          padding: 8px 20px;
          background: transparent;
          border: 2px solid #46d369;
          color: #46d369;
          font-size: 0.85rem;
          font-weight: 700;
          border-radius: 3px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .copy-btn:hover, .copy-btn.copied { background: #46d369; color: #000; }

        .history-card {
          width: 100%;
          max-width: 680px;
          background: rgba(20,20,20,0.75);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .history-header {
          padding: 14px 24px;
          font-size: 0.7rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #a3a3a3;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s;
        }

        .history-item:hover { background: rgba(255,255,255,0.04); }
        .history-item:last-child { border-bottom: none; }

        .history-url {
          color: #e5e5e5;
          font-size: 0.9rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 70%;
        }

        .history-copy {
          padding: 4px 14px;
          background: transparent;
          border: 1px solid #333;
          color: #a3a3a3;
          font-size: 0.8rem;
          border-radius: 3px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .history-copy:hover { border-color: #e50914; color: #e50914; }

        .footer {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 20px;
          color: #555;
          font-size: 0.8rem;
          border-top: 1px solid #222;
        }
      `}</style>

      <div className="bg-grid">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="bg-grid-item" />
        ))}
      </div>
      <div className="overlay" />

      <div className="hero">
        <nav className="navbar">
          <div className="logo">URL<span>SHORT</span></div>
        </nav>

        <div className="hero-content">
          <h1 className="hero-title">Shorten Your URL</h1>
          <p className="hero-subtitle">Paste a long URL and get a short one instantly!</p>
          <p className="hero-sub2">Fast. Free. No signup required.</p>

          <div className="input-area">
            <input
              className="url-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && shorten()}
              placeholder="Paste your long URL here..."
            />
            <button className="shorten-btn" onClick={shorten} disabled={loading}>
              {loading ? "..." : "Shorten"}
            </button>
          </div>

          {error && <p className="error-msg">⚠ {error}</p>}

          {result && (
            <div className="result-card">
              <div className="result-label">Your Short URL</div>
              <div className="result-row">
                <a className="result-url" href={result.short_url} target="_blank" rel="noreferrer">
                  {result.short_url}
                </a>
                <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={() => copy(result.short_url)}>
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="history-card">
              <div className="history-header">Recent URLs</div>
              {history.map((item, i) => (
                <div key={i} className="history-item">
                  <span className="history-url">{item.short_url}</span>
                  <button className="history-copy" onClick={() => copy(item.short_url)}>Copy</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="footer">
          © 2025 URLShort — Built with FastAPI, React & Docker
        </div>
      </div>
    </>
  );
}
