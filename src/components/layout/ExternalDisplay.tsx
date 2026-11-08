import { emit, listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import Screen from "./interface/Screen";
import type { ScriptureSelection } from "@/store/globalStore";
import { useIsTauri } from "@/hooks/useIsTauri";

const LIVE_OUTPUT_EVENT = "logikos://live-output-changed";
const EXTERNAL_DISPLAY_READY_EVENT = "logikos://external-display-ready";

function announceReady() {
  void emit(EXTERNAL_DISPLAY_READY_EVENT).catch((error) => {
    console.error("Failed to announce the external display:", error);
  });
}

const ExternalDisplay = () => {
  const isTauri = useIsTauri();
  const [scripture, setScripture] = useState<ScriptureSelection | null>(null);

  useEffect(() => {
    if (!isTauri) return;

    let unlisten: (() => void) | undefined;
    let retryTimers: number[] = [];
    let cancelled = false;

    listen<ScriptureSelection | null>(LIVE_OUTPUT_EVENT, (event) => {
      setScripture(event.payload);
    }).then((cleanup) => {
      if (cancelled) {
        cleanup();
      } else {
        unlisten = cleanup;
        announceReady();
        retryTimers = [250, 750, 1500].map((delay) =>
          window.setTimeout(announceReady, delay),
        );
      }
    }).catch((error) => {
      console.error("Failed to listen for live output updates:", error);
    });

    return () => {
      cancelled = true;
      unlisten?.();
      retryTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [isTauri]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <Screen output="live" scripture={scripture} className="h-full min-h-screen" />
    </main>
  );
};

export default ExternalDisplay;
