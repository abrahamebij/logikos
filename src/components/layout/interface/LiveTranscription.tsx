import { BarVisualizer } from "@/components/ui/bar-visualizer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDemoSignal } from "@/hooks/use-demo-signal";

const LiveTranscription = () => {
  const signal = useDemoSignal({ kind: "speech" });
  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <h2 className="font-semibold">Live Transcription</h2>
        <div className="pt-4">
          <BarVisualizer
            aria-label="Voice activity"
            className="text-primary h-6 max-w-sm"
            source={signal.visual}
          />
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, autem!
        </p>
      </CardContent>
    </Card>
  );
};

export default LiveTranscription;
