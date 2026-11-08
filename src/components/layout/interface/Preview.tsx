import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGlobalStore } from "@/store/globalStore";

const Preview = () => {
  const { selectedScripture } = useGlobalStore();
  console.log("selectedScripture: ", selectedScripture);
  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <h2 className="font-semibold">Preview</h2>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-black h-40">
          {selectedScripture ? (
            <div className="text-white p-4">
              <h3 className="text-sm font-semibold">{selectedScripture.text}</h3>
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
