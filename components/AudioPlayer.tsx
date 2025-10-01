"use client";

import { useState, useRef } from "react";

interface AudioPlayerProps {
  audioUrl: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = async () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }

    const audio = new Audio("/api/audio?url=https://drive.usercontent.google.com/download?id=1Pw24zk05c-PEwpGApvhhkl5sAU9ZnzdC&export=preview"); // ✅ stream through your proxy
    audioRef.current = audio;

    setIsLoading(true);
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Playback error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePlay}
        disabled={isLoading}
        className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 disabled:bg-slate-400"
      >
        {isLoading ? "Loading..." : isPlaying ? "Stop" : "Play Podcast"}
      </button>
      <audio ref={audioRef} controls>
        <source src={`/api/audio?url=https://drive.usercontent.google.com/download?id=1Pw24zk05c-PEwpGApvhhkl5sAU9ZnzdC&export=preview`} type="audio/mpeg" />
      </audio>
    </div>
  );
}
