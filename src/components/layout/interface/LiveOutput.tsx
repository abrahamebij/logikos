import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Screen from "./Screen";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BsGear, BsGearFill } from "react-icons/bs";
import {
  availableMonitors,
  primaryMonitor,
  type Monitor,
} from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { emitTo, listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { useGlobalStore } from "@/store/globalStore";
import { useIsTauri } from "@/hooks/useIsTauri";
import { ChevronDown } from "lucide-react";

const LIVE_OUTPUT_EVENT = "logikos://live-output-changed";
const EXTERNAL_DISPLAY_READY_EVENT = "logikos://external-display-ready";
const EXTERNAL_DISPLAY_LABEL = "external-display";

function monitorKey(monitor: Monitor) {
  return `${monitor.position.x}:${monitor.position.y}:${monitor.size.width}:${monitor.size.height}`;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function sendLiveOutput(scripture: ReturnType<typeof useGlobalStore.getState>["liveOutput"]) {
  return emitTo(EXTERNAL_DISPLAY_LABEL, LIVE_OUTPUT_EVENT, scripture);
}

const LiveOutput = () => {
  const isTauri = useIsTauri();
  const liveOutput = useGlobalStore((state) => state.liveOutput);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [selectedMonitorKey, setSelectedMonitorKey] = useState<string>();
  const [monitorError, setMonitorError] = useState<string>();

  const loadMonitors = async () => {
    try {
      const available = await availableMonitors();
      setMonitors(available);
      setMonitorError(undefined);

      let primary: Monitor | null = null;
      try {
        primary = await primaryMonitor();
      } catch (error) {
        console.error("Failed to detect the primary display:", error);
      }

      const defaultMonitor = primary
        ? available.find((monitor) => monitorKey(monitor) === monitorKey(primary))
        : available[0];
      setSelectedMonitorKey(defaultMonitor ? monitorKey(defaultMonitor) : undefined);
    } catch (error) {
      console.error("Failed to detect displays:", error);
      setMonitors([]);
      setMonitorError(error instanceof Error ? error.message : String(error));
    }
  };

  useEffect(() => {
    if (!isTauri) return;
    void loadMonitors();
  }, [isTauri]);

  useEffect(() => {
    if (!isTauri) return;
    void sendLiveOutput(liveOutput).catch((error) => {
      console.error("Failed to synchronize live output:", error);
    });
  }, [isTauri, liveOutput]);

  useEffect(() => {
    if (!isTauri) return;

    let unlisten: (() => void) | undefined;
    let cancelled = false;

    listen(EXTERNAL_DISPLAY_READY_EVENT, () => {
      void sendLiveOutput(liveOutput).catch((error) => {
        console.error("Failed to synchronize initial live output:", error);
      });
    }).then((cleanup) => {
      if (cancelled) {
        cleanup();
      } else {
        unlisten = cleanup;
      }
    }).catch((error) => {
      console.error("Failed to listen for external display readiness:", error);
    });

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [isTauri, liveOutput]);

  const openOnMonitor = async (monitor: Monitor) => {
    if (!isTauri) return;
    setSelectedMonitorKey(monitorKey(monitor));

    try {
      const position = monitor.position.toLogical(monitor.scaleFactor);
      const existingWindow = await WebviewWindow.getByLabel(EXTERNAL_DISPLAY_LABEL);
      const externalWindow =
        existingWindow ??
        new WebviewWindow(EXTERNAL_DISPLAY_LABEL, {
          url: "/?display=external",
          title: "Logikos Output",
          decorations: false,
          resizable: false,
          x: position.x,
          y: position.y,
          width: monitor.size.width / monitor.scaleFactor,
          height: monitor.size.height / monitor.scaleFactor,
        });

      if (!existingWindow) {
        await new Promise<void>((resolve, reject) => {
          externalWindow.once("tauri://created", () => resolve());
          externalWindow.once("tauri://error", (event) => reject(event.payload));
        });
      }

      await externalWindow.setFullscreenOnMonitor(monitor.position);
      for (const delay of [0, 250, 750, 1500]) {
        if (delay > 0) await wait(delay);
        await sendLiveOutput(liveOutput);
      }
    } catch (error) {
      console.error("Failed to open live output on the selected display:", error);
    }
  };

  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="flex items-center justify-between border-b">
        <h2 className="font-semibold">Output</h2>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                aria-label="Select output display"
                className="w-fit p-0 gap-0.5 bg-transparent! hover:bg-transparent text-sm text-muted-foreground! h-fit"
                variant="ghost"
              >
                <BsGear aria-hidden="true" />
                <ChevronDown aria-hidden="true" className="text-xs" />
              </Button>
            }
          />
          <DropdownMenuContent>
            {monitors.length > 0 ? (
              monitors.map((monitor, index) => {
                const key = monitorKey(monitor);
                return (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => void openOnMonitor(monitor)}
                  >
                    {monitor.name ?? `Display ${index + 1}`}
                    {selectedMonitorKey === key ? " (Selected)" : ""}
                  </DropdownMenuItem>
                );
              })
            ) : (
              <>
                <DropdownMenuItem disabled>
                  {!isTauri
                    ? "Available in the desktop app"
                    : monitorError
                      ? `Display detection failed: ${monitorError}`
                      : "No displays detected"}
                </DropdownMenuItem>
                {isTauri && (
                  <DropdownMenuItem onClick={() => void loadMonitors()}>
                    Retry display detection
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0">
        <Screen output="live" />
      </CardContent>
    </Card>
  );
};

export default LiveOutput;