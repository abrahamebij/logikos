import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGlobalStore } from "@/store/globalStore";
import Screen from "./Screen";

const AIPreview = () => {
  const aiOutput = useGlobalStore((state) => state.aiOutput);
  const setLiveOutput = useGlobalStore((state) => state.setLiveOutput);

  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <h2 className="font-semibold">AI Preview</h2>
      </CardHeader>
      <CardContent className="p-0">
        <Screen
          output="ai"
          onDoubleClick={() => {
            if (aiOutput) setLiveOutput(aiOutput);
          }}
        />
      </CardContent>
    </Card>
  );
};

export default AIPreview;
