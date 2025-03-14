import { useEffect, useState } from "react";

function useLocalStorageState(key, defaultValue) {
  const storageKey = `filter-${key}`;

  const [state, setState] = useState(() => {
    try {
      const localStorageValue = localStorage.getItem(storageKey);
      return localStorageValue ? JSON.parse(localStorageValue) : defaultValue;
    } catch (error) {
      console.error(`Error parsing localStorage for ${key}:`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (state.length === 0) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState];
}

export function useResetOnNavigation(setters) {
  const currentPath = window.location.pathname;

  useEffect(() => {
    const lastPath = sessionStorage.getItem("lastPath");

    if (lastPath && lastPath !== currentPath) {
      setters.forEach((setState) => setState([]));
      localStorage.clear();
    }

    sessionStorage.setItem("lastPath", currentPath);
  }, [currentPath, setters]);
}

export default useLocalStorageState;
