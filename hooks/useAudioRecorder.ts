"use client";

import { useRef, useCallback, useState } from "react";

export function useAudioRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioBlobUrl(URL.createObjectURL(blob));
        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = mr;
      mr.start(1000);
      setIsRecording(true);
    } catch (err) { console.error("Recording failed:", err); }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
  }, []);

  const uploadAudio = useCallback(async (interviewId: string): Promise<string | null> => {
    if (!audioBlob) return null;
    try {
      const reader = new FileReader();
      const b64 = await new Promise<string>((res) => { reader.onloadend = () => res(reader.result as string); reader.readAsDataURL(audioBlob); });
      const r = await fetch("/api/upload-audio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ interviewId, audioData: b64 }) });
      if (r.ok) { const d = await r.json(); return d.audioUrl; }
      return null;
    } catch { return null; }
  }, [audioBlob]);

  return { isRecording, audioBlob, audioBlobUrl, startRecording, stopRecording, uploadAudio };
}
