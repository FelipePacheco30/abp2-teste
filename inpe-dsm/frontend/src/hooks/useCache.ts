export function useCache<T>(key: string, initialValue: T) {
  const cached = localStorage.getItem(key);
  if (cached) {
    return JSON.parse(cached) as T;
  }
  localStorage.setItem(key, JSON.stringify(initialValue));
  return initialValue;
}
