"use client";

import { useRef, useState } from "react";

interface AudioPlayerProps {
  audioUrl: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setPlaying(!playing);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const changeSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  return (
    <div style={{ background: "#191919", border: "4px solid #bcff5f", padding: "20px", boxShadow: "4px 4px 0px 0px #bcff5f" }}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={() => {
          if (!audioRef.current) return;
          setCurrentTime(audioRef.current.currentTime);
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={() => setPlaying(false)}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#bcff5f", fontVariationSettings: "'FILL' 1" }}>mic</span>
        <span style={{ fontSize: "10px", color: "#bcff5f", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          INTERVIEW RECORDING
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Play/Pause */}
        <button onClick={toggle} style={{ width: "44px", height: "44px", background: "#bcff5f", border: "4px solid #000", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "3px 3px 0px 0px #000", flexShrink: 0 }}>
          <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "#000", fontVariationSettings: "'FILL' 1" }}>
            {playing ? "pause" : "play_arrow"}
          </span>
        </button>

        {/* Time */}
        <span style={{ fontSize: "12px", color: "#757575", fontWeight: 700, minWidth: "45px", fontFamily: "monospace" }}>{fmt(currentTime)}</span>

        {/* Progress */}
        <div
          style={{ flex: 1, height: "8px", background: "#0e0e0e", border: "2px solid #484848", cursor: "pointer", position: "relative" }}
          onClick={(e) => {
            if (!audioRef.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            audioRef.current.currentTime = pct * duration;
          }}
        >
          <div style={{ height: "100%", background: "#bcff5f", width: `${progress}%`, transition: "width 0.1s" }} />
        </div>

        {/* Duration */}
        <span style={{ fontSize: "12px", color: "#757575", fontWeight: 700, minWidth: "45px", fontFamily: "monospace" }}>{fmt(duration)}</span>

        {/* Speed */}
        <button onClick={changeSpeed} style={{ padding: "4px 10px", background: "transparent", border: "2px solid #484848", color: "#ababab", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}>
          {speed}x
        </button>
      </div>
    </div>
  );
}
