import { useState, useEffect } from 'react';

export function useIsTauri() {
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    // Detects if the Tauri runtime environment exists on the window object
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      setInApp(true);
    }
  }, []);

  return inApp;
}
