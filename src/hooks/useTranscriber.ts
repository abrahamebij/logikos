import { useEffect, useRef, useState } from "react";

import { useGlobalStore } from "@/store/globalStore";

// Describe the worker messages handled by this hook.
type TranscriberMessage =
  | { type: "ready" }
  | { type: "transcript"; text: string };

// Expose the worker's model loading state to the component using the hook.
export interface UseTranscriberResult {
  modelReady: boolean;
}

// Connect an existing recording stream to the transcription worker.
export const useTranscriber = (
  audioStream: MediaStream | null,
): UseTranscriberResult => {
  // Get the store action used to append recognized speech.
  const appendTranscript = useGlobalStore((state) => state.appendTranscript);
  // Keep the worker instance available to the audio effect and cleanup callbacks.
  const workerRef = useRef<Worker | null>(null);
  // Track readiness without causing audio event handlers to be recreated.
  const workerReadyRef = useRef(false);
  // Track readiness for consumers that need to render model status.
  const [modelReady, setModelReady] = useState(false);

  // Create and initialize the worker once for this hook instance.
  useEffect(() => {
    // Load the worker as an ES module so Vite can bundle its dependencies.
    const worker = new Worker(
      new URL("../workers/transcriber.worker.ts", import.meta.url),
      { type: "module" },
    );
    // Store the worker so the stream effect can send audio to it.
    workerRef.current = worker;

    // Handle readiness and transcript messages from the worker.
    worker.addEventListener(
      "message",
      (event: MessageEvent<TranscriberMessage>) => {
        // Mark the model ready after the worker finishes loading it.
        if (event.data.type === "ready") {
          workerReadyRef.current = true;
          setModelReady(true);
          return;
        }

        // Ignore empty recognition results and append useful text globally.
        if (event.data.type === "transcript" && event.data.text.trim()) {
          appendTranscript(event.data.text);
        }
      },
    );
    // Ask the worker to load its speech-recognition model.
    worker.postMessage({ type: "load" });

    // Terminate the worker when the component using this hook unmounts.
    return () => {
      worker.terminate();
      workerRef.current = null;
      workerReadyRef.current = false;
    };
  }, [appendTranscript]);

  // Connect and disconnect the current recording stream.
  useEffect(() => {
    // Do not create audio nodes until a stream is available and supported.
    if (!audioStream || typeof AudioContext === "undefined") {
      return;
    }

    // Use a dedicated context configured for Whisper's 16 kHz input rate.
    const context = new AudioContext({ sampleRate: 16000 });
    // Convert the media stream into an audio-node source.
    const source = context.createMediaStreamSource(audioStream);
    // Keep the worklet reference for later disconnection.
    let node: AudioWorkletNode | null = null;
    // Prevent late async setup from connecting after cleanup.
    let disposed = false;

    // Load the worklet and connect the stream once it is ready.
    const connect = async () => {
      try {
        // Register the worklet processor served from the public directory.
        await context.audioWorklet.addModule("/chunker-worklet.js");
        // Stop setup if the stream changed while the module was loading.
        if (disposed) {
          return;
        }

        // Create the processor registered by chunker-worklet.js.
        node = new AudioWorkletNode(context, "chunker-processor");
        // Forward each approximately three-second audio chunk to the worker.
        node.port.addEventListener(
          "message",
          (event: MessageEvent<Float32Array>) => {
            // Wait until the model has finished loading before sending audio.
            if (!workerReadyRef.current) {
              return;
            }

            // Transfer the buffer instead of copying the audio data.
            const audio = event.data;
            workerRef.current?.postMessage({ type: "audio", audio }, [
              audio.buffer,
            ]);
          },
        );
        // Feed microphone samples into the chunker.
        source.connect(node);
        // Keep the processing graph active.
        node.connect(context.destination);
      } catch (error) {
        // Report setup failures while allowing the component to remain mounted.
        if (!disposed) {
          console.error(
            "Unable to initialize the transcription audio worklet",
            error,
          );
        }
      }
    };

    // Start asynchronous worklet setup without blocking the effect.
    void connect();

    // Release every audio resource when the stream is removed or replaced.
    return () => {
      // Mark pending setup as cancelled before disconnecting nodes.
      disposed = true;
      // Disconnect the media stream source from the processing graph.
      source.disconnect();
      // Close the worklet message port.
      node?.port.close();
      // Disconnect the worklet node from the audio graph.
      node?.disconnect();
      // Close the dedicated audio context.
      void context.close();
    };
  }, [audioStream]);

  // Return the current model readiness state to the caller.
  return { modelReady };
};
