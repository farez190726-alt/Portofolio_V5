// Lightweight anonymous visitor identity, persisted in localStorage.
// Used to let visitors like photos / react to comments without an
// account, while still preventing a single click from voting twice.
// This is a convenience identifier, not a security boundary — it can
// be cleared by the visitor, which is an acceptable trade-off for a
// public portfolio site.

const STORAGE_KEY = "portfolio_visitor_id";

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getVisitorId() {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (privacy mode, etc.) — fall back to a
    // per-session id so reactions still work for the current visit.
    return generateId();
  }
}
