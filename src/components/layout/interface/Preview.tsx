import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGlobalStore } from "@/store/globalStore";
import Screen from "./Screen";

const Preview = () => {
  const selectedScripture = useGlobalStore((state) => state.selectedScripture);
  const setLiveOutput = useGlobalStore((state) => state.setLiveOutput);

  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <h2 className="font-semibold">Preview</h2>
      </CardHeader>
      <CardContent className="p-0">
        <Screen
          output="selected"
          onDoubleClick={() => {
            if (selectedScripture) setLiveOutput(selectedScripture);
          }}
        />
      </CardContent>
    </Card>
  );
};

export default Preview;
