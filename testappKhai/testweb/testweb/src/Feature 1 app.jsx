import { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";
import "./App.css";

// ── Data ──────────────────────────────────────────────────────────────────────
// In production, import the JSON directly:
// import DICT from "./complete.json";
// For now we load it dynamically from the same origin or a bundler-resolved path.
// Adjust the path below to match your setup.
const DICT_URL = "complete.json";

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  { id: "Feature 1",  label: "Feature 1",  icon: "🃏" },
    { id: "Feature 2", label: "Feature 2",  icon: "📊" },
    { id: "Feature 3", label: "Feature 3",    icon: "⚙️" },
    { id: "Feature 4", label: "Feature 4",       icon: "🎵" },
    { id: "Feature 5", label: "Feature 5",     icon: "✏️" },
    { id: "Feature 6", label: "Feature 6",   icon: "📈" },
    { id: "Feature 7", label: "Feature 7",     icon: "📖" },
    { id: "Feature 8", label: "Feature 8",        icon: "🎯" },
    { id: "Feature 9", label: "Feature 9", icon: "🎯" },
    { id: "Feature 10", label: "Feature 10",        icon: "🎯" },
];

// ── Search logic ──────────────────────────────────────────────────────────────
function searchDict(dict, query) {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  const results = [];

  for (const entry of dict) {
    if (results.length >= 12) break;

    const simplified = entry.simplified || "";
    const traditional = entry.forms?.[0]?.traditional || "";
    const pinyin = entry.forms?.[0]?.transcriptions?.pinyin || "";
    const meanings = entry.forms?.flatMap((f) => f.meanings || []).join(" ").toLowerCase();

    const score =
      simplified === q ? 100 :
      traditional === q ? 90 :
      simplified.startsWith(q) ? 80 :
      pinyin.toLowerCase().startsWith(q) ? 70 :
      simplified.includes(q) ? 50 :
      meanings.includes(q) ? 30 : 0;

    if (score > 0) results.push({ entry, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.map((r) => r.entry);
}

// ── Detail View ───────────────────────────────────────────────────────────────
function DetailView({ entry, onBack }) {
  return (
    <div className="detail-view">
      <div className="detail-back" onClick={onBack}>
        ← Back
      </div>
      <pre className="detail-json">{JSON.stringify(entry, null, 2)}</pre>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [dict, setDict] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [detailEntry, setDetailEntry] = useState(null);   // null = home view
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load dictionary
  useEffect(() => {
    fetch(DICT_URL)
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data) => setDict(data))
      .catch(() => setLoadError(true));
  }, []);

  // Run search whenever query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    const found = searchDict(dict, query);
    setResults(found);
    setOpen(found.length > 0);
  }, [query, dict]);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = useCallback((entry) => {
    setOpen(false);
    setQuery("");
    // Open in a new tab by storing the entry in sessionStorage keyed by index
    const key = `dict_entry_${Date.now()}`;
    try {
      sessionStorage.setItem(key, JSON.stringify(entry));
    } catch (_) {}
    const url = `${window.location.origin}${window.location.pathname}?entry=${encodeURIComponent(key)}`;
    window.open(url, "_blank");
  }, []);

  const handleFeatureClick = useCallback((feature) => {
    // Placeholder — navigate or open feature panel
 //   alert(`Feature "${feature.label}" coming soon!`);
    const url = `${feature.label}.html`;
    window.open(url, "_blank");
  }, []);

  // Check if we're a detail tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("entry");
    if (key) {
      try {
        const raw = sessionStorage.getItem(key);
        if (raw) setDetailEntry(JSON.parse(raw));
      } catch (_) {}
    }
  }, []);

  // ── Render detail tab ──
  if (detailEntry) {
    return <DetailView entry={detailEntry} onBack={() => window.close()} />;
  }

  // ── Render home ──
  const firstMeaning = (entry) =>
    entry.forms?.[0]?.meanings?.[0] || "—";
  const firstPinyin = (entry) =>
    entry.forms?.[0]?.transcriptions?.pinyin || "";
  const level = (entry) =>
    entry.level?.[0] || "";

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1 className="header-title">Feature 1</h1>
        <p className="header-sub">Chinese Dictionary</p>
      </header>

      {/* Search */}
      <div className="search-wrapper">
        <div className="search-box">
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search by character, pinyin, or meaning…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="search-icon">🔍</span>

          {open && (
            <div className="search-dropdown" ref={dropdownRef}>
              {results.length === 0 ? (
                <div className="search-no-results">No results found</div>
              ) : (
                results.map((entry, i) => (
                  <div
                    key={i}
                    className="search-result-item"
                    onClick={() => handleSelect(entry)}
                  >
                    <span className="result-char">{entry.simplified}</span>
                    <div className="result-info">
                      <div className="result-pinyin">{firstPinyin(entry)}</div>
                      <div className="result-meaning">{firstMeaning(entry)}</div>
                    </div>
                    {level(entry) && (
                      <span className="result-tag">{level(entry)}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features bar */}
      <section className="features-section">
        <div className="features-scroll">
          {FEATURES.map((f) => (
            <button
              key={f.id}
              className="feature-card"
              onClick={() => handleFeatureClick(f)}
              aria-label={f.label}
            >
              <div className="feature-icon">
                <span className="feature-icon-inner">{f.icon}</span>
              </div>
              <span className="feature-label">{f.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Content area — reserved for future content */}
      <main className="content-area">
        {loadError ? (
          <div className="content-placeholder">
            <span className="content-placeholder-char">⚠</span>
            <span className="content-placeholder-text">
              Could not load dictionary — check that complete.json is served from the same origin
            </span>
          </div>
        ) : dict.length === 0 ? (
          <div className="content-placeholder">
            <span className="content-placeholder-char">…</span>
            <span className="content-placeholder-text">Loading dictionary</span>
          </div>
        ) : (
          <div className="content-placeholder">
            <span className="content-placeholder-char">字</span>
            <span className="content-placeholder-text">
              {dict.length.toLocaleString()} entries loaded · more coming soon
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
