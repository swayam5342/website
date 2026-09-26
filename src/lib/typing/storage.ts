/** localStorage wrappers that never throw: private mode and blocked
 *  site data return the fallback instead of breaking the test. */

export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStored(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or blocked storage — the test works fine without persistence.
  }
}
