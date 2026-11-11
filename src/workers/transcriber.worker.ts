import { env, pipeline } from "@huggingface/transformers";

type Transcriber = (
  audio: Float32Array,
  options: { language: string },
) => Promise<{ text?: string }>;

let transcriber: Transcriber | null = null;

// Restrict model resolution to files served from this application's public directory.
env.allowRemoteModels = false;
env.allowLocalModels = true;

self.onmessage = async ({ data }) => {
  if (data.type === "load") {
    try {
      try {
        transcriber = (await pipeline(
          "automatic-speech-recognition",
          "/models/whisper-base.en",
          {
            device: "webgpu",
            dtype: "q4",
            local_files_only: true,
          },
        )) as Transcriber;
      } catch {
        transcriber = (await pipeline(
          "automatic-speech-recognition",
          "/models/whisper-base.en",
          {
            device: "wasm",
            dtype: "q4",
            local_files_only: true,
          },
        )) as Transcriber;
      }
      self.postMessage({ type: "ready" });
    } catch (error) {
      self.postMessage({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to load the transcription model",
      });
    }
  } else if (data.type === "audio" && transcriber) {
    try {
      const out = await transcriber(data.audio, { language: "en" });
      self.postMessage({ type: "transcript", text: out.text ?? "" });
    } catch (error) {
      self.postMessage({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to transcribe the audio chunk",
      });
    }
  }
};