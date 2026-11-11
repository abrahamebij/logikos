import { BarVisualizer } from "@/components/ui/bar-visualizer";
import { useTranscriber } from "@/hooks/useTranscriber";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRecording } from "@/hooks/use-recording";
import { useGlobalStore } from "@/store/globalStore";
import SettingsDropdown from "./SettingsDropdown";

const LiveTranscription = () => {
  const recording = useRecording();
  useTranscriber(recording.audioStream);
  const transcript = useGlobalStore((state) => state.transcript);
  console.log('transcript: ', transcript);

  return (
    <Card className="gap-0 pb-0">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Live Transcription</h2>
          <SettingsDropdown ariaLabel="Select microphone">
            {!recording.hasMicrophoneAccess ? (
              <DropdownMenuItem
                onClick={() => void recording.requestMicrophoneAccess()}
              >
                Allow microphone access
              </DropdownMenuItem>
            ) : (
              <>
                {recording.microphones.map((microphone, index) => (
                  <DropdownMenuItem
                    key={microphone.deviceId || `microphone-${index}`}
                    onClick={() => void recording.start(microphone.deviceId)}
                  >
                    {microphone.label || `Microphone ${index + 1}`}
                  </DropdownMenuItem>
                ))}
                {recording.status === "recording" && (
                  <DropdownMenuItem onClick={() => void recording.stop()}>
                    Stop recording
                  </DropdownMenuItem>
                )}
              </>
            )}
            {recording.error && (
              <DropdownMenuItem disabled>{recording.error}</DropdownMenuItem>
            )}
          </SettingsDropdown>
        </div>
        <div className="pt-4">
          <BarVisualizer
            aria-label="Voice activity"
            className="text-primary h-6 max-w-sm"
            source={recording.visual}
          />
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <p className="text-muted-foreground text-sm">
          {transcript.length > 0
            ? transcript.join(" ")
            : "Select a microphone to begin"}
        </p>
      </CardContent>
    </Card>
  );
};

export default LiveTranscription;
