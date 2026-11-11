// src/workers/transcriber.worker.ts
import { pipeline } from "@huggingface/transformers";

let transcriber: any;

self.onmessage = async ({ data }) => {
  if (data.type === "load") {
    try {
      transcriber = await pipeline("automatic-speech-recognition", "onnx-community/whisper-base.en", {
        device: "webgpu",
        dtype: "q4",
      });
    } catch {
      transcriber = await pipeline("automatic-speech-recognition", "onnx-community/whisper-base.en", {
        device: "wasm",
        dtype: "q8",
      });
    }
    self.postMessage({ type: "ready" });
  } else if (data.type === "audio") {
    const out = await transcriber(data.audio, { language: "en" });
    self.postMessage({ type: "transcript", text: out.text });
  }
};