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

// Vertical padding around the verse, and the largest text size as a share of screen height.
const PADDING = 32;
const MAX_TEXT_RATIO = 0.11;

const Screen = ({
  output,
  onDoubleClick,
  scripture: providedScripture,
  className,
}: ScreenProps) => {
  const storedScripture = useGlobalStore((state) =>
    output === "selected" ? state.selectedScripture : state.liveOutput,
  );
  const scripture =
    providedScripture === undefined ? storedScripture : providedScripture;
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

  // The reference label scales with the screen so it stays readable when projected.
  const referenceSize = Math.min(64, Math.max(12, screenHeight * 0.045));

  // Finds the largest font size where the verse still fits the screen.
  const textSize = useMemo(() => {
    if (!scripture || screenWidth <= 0 || screenHeight <= 0) return 16;

    const lineHeightRatio = 1.15;
    const availableHeight = Math.max(
      0,
      screenHeight - PADDING - referenceSize * 1.5,
    );
    let low = 12;
    let high = Math.max(low, Math.floor(screenHeight * MAX_TEXT_RATIO));

    while (low <= high) {
      const size = Math.floor((low + high) / 2);
      const prepared = prepare(scripture.text, `600 ${size}px Geist`);
      const result = layout(prepared, screenWidth, size * lineHeightRatio);

      if (result.height <= availableHeight) {
        low = size + 1;
      } else {
        high = size - 1;
      }
    }

    return high;
  }, [referenceSize, screenHeight, screenWidth, scripture]);

  return (
    <div
      ref={screenRef}
      className={`bg-black ${className ?? "aspect-video"}`}
      onDoubleClick={onDoubleClick}
    >
      {scripture ? (
        <div className="text-white p-4 h-full flex flex-col justify-center relative">
          <h3
            className="font-semibold text-center"
            style={{
              fontSize: `${textSize}px`,
              lineHeight: 1.15,
            }}
          >
            {scripture.text}
          </h3>
          <p
            className="text-right absolute bottom-1 right-4"
            style={{ fontSize: `${referenceSize - 2}px`, lineHeight: 1.5 }}
          >
            {scripture.book} {scripture.chapter}:{scripture.verse}
          </p>
        </div>
      ) : (
        <div className="text-white text-center text-3xl flex flex-1 items-center justify-center h-full p-4">
          <p>No scripture selected</p>
        </div>
      )}
    </div>
  );
};

export default Screen;
