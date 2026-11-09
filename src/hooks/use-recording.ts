import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAudioContext } from "./use-audio-context";
import { createFrameEmitter } from "@/lib/frame-source";
import type { FrameSource, VisualFrame } from "@/lib/types";

export type RecordingStatus = "idle" | "recording" | "stopping";

export interface UseRecordingResult {
  audioStream: MediaStream | null;
  recordingBlob: Blob | null;
  microphones: MediaDeviceInfo[];
  hasMicrophoneAccess: boolean;
  status: RecordingStatus;
  error: string | null;
  visual: FrameSource<VisualFrame>;
  requestMicrophoneAccess: () => Promise<void>;
  start: (deviceId?: string) => Promise<void>;
  stop: () => Promise<Blob | null>;
}

const FFT_SIZE = 64;
const HISTORY_SIZE = 60;

const getRecorderOptions = (): MediaRecorderOptions | undefined => {
  if (typeof MediaRecorder === "undefined") {
    return undefined;
  }

  const preferredTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg"];
  const mimeType = preferredTypes.find((type) =>
    MediaRecorder.isTypeSupported(type),
  );
  return mimeType ? { mimeType } : undefined;
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unable to access the microphone";

export const useRecording = (): UseRecordingResult => {
  const { context, resume } = useAudioContext();
  const visual = useMemo(() => createFrameEmitter<VisualFrame>(), []);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const frameIdRef = useRef<number | null>(null);
  const historyRef = useRef(new Float32Array(HISTORY_SIZE));
  const historyIndexRef = useRef(0);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [hasMicrophoneAccess, setHasMicrophoneAccess] = useState(false);
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const refreshMicrophones = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputs = devices.filter((device) => device.kind === "audioinput");
    setMicrophones(inputs);
    setHasMicrophoneAccess(inputs.some((device) => device.label.length > 0));
  }, []);

  const requestMicrophoneAccess = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone access is not supported in this environment");
      return;
    }

    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      await refreshMicrophones();
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    }
  }, [refreshMicrophones]);

  const stopFrames = useCallback(() => {
    if (frameIdRef.current !== null) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }
  }, []);

  const paintFrame = useCallback(
    (timestamp: number) => {
      const analyser = analyserRef.current;
      if (!analyser) return;

      const byteBands = new Uint8Array(analyser.frequencyBinCount);
      const bands = new Float32Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(byteBands);
      for (let index = 0; index < bands.length; index += 1) {
        bands[index] = (byteBands[index] ?? 0) / 255;
      }

      const history = historyRef.current;
      const historyIndex = historyIndexRef.current;
      const average =
        bands.reduce((total, value) => total + value, 0) / bands.length;
      history[historyIndex] = average;
      historyIndexRef.current = (historyIndex + 1) % HISTORY_SIZE;

      visual.emit({
        bands,
        history,
        historyStart: historyIndexRef.current,
        historyLength: HISTORY_SIZE,
        historyUpdatedAt: timestamp,
        historyIntervalMs: 1000 / 60,
        peakDb: average > 0 ? 20 * Math.log10(average) : -Infinity,
      });
      frameIdRef.current = requestAnimationFrame(paintFrame);
    },
    [visual],
  );

  const stop = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      return recordingBlob;
    }

    setStatus("stopping");
    const blob = await new Promise<Blob>((resolve) => {
      recorder.addEventListener(
        "stop",
        () => {
          resolve(new Blob(chunksRef.current, { type: recorder.mimeType }));
        },
        { once: true },
      );
      recorder.stop();
    });

    stopFrames();
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    analyserRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    setAudioStream(null);
    setRecordingBlob(blob);
    setStatus("idle");
    return blob;
  }, [recordingBlob, stopFrames]);

  const start = useCallback(async (deviceId?: string) => {
    if (status === "recording") return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Audio recording is not supported in this environment");
      return;
    }

    try {
      setError(null);
      setRecordingBlob(null);
      await resume();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      });
      if (!context) {
        stream.getTracks().forEach((track) => track.stop());
        throw new Error("Audio processing is not available");
      }

      const analyser = context.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.75;
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);

      const recorder = new MediaRecorder(stream, getRecorderOptions());
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      });
      recorder.start();

      streamRef.current = stream;
      sourceRef.current = source;
      analyserRef.current = analyser;
      recorderRef.current = recorder;
      setAudioStream(stream);
      setStatus("recording");
      await refreshMicrophones();
      frameIdRef.current = requestAnimationFrame(paintFrame);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      setStatus("idle");
    }
  }, [context, paintFrame, refreshMicrophones, resume, status]);

  useEffect(() => {
    void refreshMicrophones().catch((caughtError) => {
      setError(getErrorMessage(caughtError));
    });
  }, [refreshMicrophones]);

  useEffect(() => {
    return () => {
      stopFrames();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      sourceRef.current?.disconnect();
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }
    };
  }, [stopFrames]);

  return {
    audioStream,
    recordingBlob,
    microphones,
    hasMicrophoneAccess,
    status,
    error,
    visual,
    requestMicrophoneAccess,
    start,
    stop,
  };
};
