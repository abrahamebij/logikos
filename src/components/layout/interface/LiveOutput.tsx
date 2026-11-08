import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Screen from "./Screen";

const LiveOutput = () => {

  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <h2 className="font-semibold">Output</h2>
      </CardHeader>
      <CardContent className="p-0">
        <Screen output="live" />
      </CardContent>
    </Card>
  );
};

export default LiveOutput;
