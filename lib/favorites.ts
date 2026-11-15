// lib/favorites.ts
// Estado compartido de favoritos sobre localStorage, compatible con SSR.

export const FAVORITES_KEY = "favorites";
export const EMPTY_FAVORITES: string[] = [];

let favoritesCache: { raw: string | null; ids: string[] } = {
  raw: null,
  ids: EMPTY_FAVORITES,
};

export function readFavorites(): string[] {
  const raw = window.localStorage.getItem(FAVORITES_KEY);
  if (raw !== favoritesCache.raw) {
    try {
      const parsed = JSON.parse(raw ?? "[]");
      favoritesCache = {
        raw,
        ids: Array.isArray(parsed)
          ? parsed.filter((id): id is string => typeof id === "string")
          : EMPTY_FAVORITES,
      };
    } catch {
      favoritesCache = { raw, ids: EMPTY_FAVORITES };
    }
  }
  return favoritesCache.ids;
}

export function subscribeToFavorites(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("favoritesChanged", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("favoritesChanged", callback);
  };
}

export function writeFavorites(ids: string[]) {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("favoritesChanged"));
}
