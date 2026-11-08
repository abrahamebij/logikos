import { useGlobalStore } from "@/store/globalStore";
import { layout, prepare } from "@chenglou/pretext";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ScriptureSelection } from "@/store/globalStore";

type ScreenProps = {
  output: "selected" | "live";
  onDoubleClick?: () => void;
  scripture?: ScriptureSelection | null;
  className?: string;
};

const Screen = ({ output, onDoubleClick, scripture: providedScripture, className }: ScreenProps) => {
  const storedScripture = useGlobalStore((state) =>
    output === "selected" ? state.selectedScripture : state.liveOutput,
  );
  const scripture = providedScripture === undefined ? storedScripture : providedScripture;
  const screenRef = useRef<HTMLDivElement>(null);
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    const element = screenRef.current;
    if (!element) return;

    const updateSize = () => {
      setScreenWidth(element.clientWidth - 32);
      setScreenHeight(element.clientHeight);
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const textSize = useMemo(() => {
    if (!scripture || screenWidth <= 0 || screenHeight <= 0) return 16;

    const lineHeightRatio = 1.15;
    const availableHeight = Math.max(0, screenHeight - 56);
    let low = 12;
    let high = 48;

    while (low <= high) {
      const size = Math.floor((low + high) / 2);
      const prepared = prepare(scripture.text, `600 ${size}px Geist`);
      const result = layout(
        prepared,
        screenWidth,
        size * lineHeightRatio,
      );

      if (result.height <= availableHeight) {
        low = size + 1;
      } else {
        high = size - 1;
      }
    }

    return high;
  }, [screenHeight, screenWidth, scripture]);

  return (
    <div
      ref={screenRef}
      className={`bg-black ${className ?? "h-40"}`}
      onDoubleClick={onDoubleClick}
    >
      {scripture ? (
        <div className="text-white p-4">
          <h3
            className="font-semibold text-center"
            style={{
              fontSize: `${textSize}px`,
              lineHeight: 1.15,
            }}
          >
            {scripture.text}
          </h3>
          <p className="text-xs text-right">
            {scripture.book} {scripture.chapter}:{scripture.verse}
          </p>
        </div>
      ) : (
        <div className="text-white p-4">
          <p>No scripture selected</p>
        </div>
      )}
    </div>
  );
};

export default Screen;
