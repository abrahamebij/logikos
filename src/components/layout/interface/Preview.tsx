import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGlobalStore } from "@/store/globalStore";
import { layout, prepare } from "@chenglou/pretext";
import { useEffect, useMemo, useRef, useState } from "react";

const Preview = () => {
  const { selectedScripture } = useGlobalStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(0);
  const [previewHeight, setPreviewHeight] = useState(0);

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;

    const updateSize = () => {
      setPreviewWidth(element.clientWidth - 32);
      setPreviewHeight(element.clientHeight);
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const textSize = useMemo(() => {
    if (!selectedScripture || previewWidth <= 0 || previewHeight <= 0) {
      return 16;
    }

    const lineHeightRatio = 1.15;
    const verticalPadding = 32;
    const referenceHeight = 16;
    const referenceGap = 8;
    const availableHeight = Math.max(
      0,
      previewHeight - verticalPadding - referenceHeight - referenceGap,
    );
    let low = 12;
    let high = 48;

    while (low <= high) {
      const size = Math.floor((low + high) / 2);
      const prepared = prepare(
        selectedScripture.text,
        `600 ${size}px Geist`,
      );
      const result = layout(
        prepared,
        previewWidth,
        size * lineHeightRatio,
      );

      if (result.height <= availableHeight) {
        low = size + 1;
      } else {
        high = size - 1;
      }
    }

    return high;
  }, [previewHeight, previewWidth, selectedScripture]);

  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <h2 className="font-semibold">Preview</h2>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={previewRef} className="bg-black h-40">
          {selectedScripture ? (
            <div className="text-white p-4">
              <h3
                className="font-semibold text-center"
                style={{
                  fontSize: `${textSize}px`,
                  lineHeight: 1.15,
                }}
              >
                {selectedScripture.text}
              </h3>
              <p className="text-xs text-right">
                {selectedScripture.book} {selectedScripture.chapter}:
                {selectedScripture.verse}
              </p>
            </div>
          ) : (
            <div className="text-white p-4">
              <p>No scripture selected</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Preview;
