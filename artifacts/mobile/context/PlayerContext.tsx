import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import type { MediaTrack } from "@/constants/sampleData";

interface PlayerState {
  currentTrack: MediaTrack | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  queue: MediaTrack[];
}

interface PlayerContextType extends PlayerState {
  play: (track: MediaTrack) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setQueue: (tracks: MediaTrack[]) => void;
  setProgress: (p: number) => void;
  togglePlay: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<MediaTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueueState] = useState<MediaTrack[]>([]);

  // Timer-based progress simulation
  // TODO: Replace with expo-av Audio implementation:
  // import { Audio } from "expo-av";
  // const soundRef = useRef<Audio.Sound | null>(null);
  // await soundRef.current?.loadAsync({ uri: track.audioUrl });
  // await soundRef.current?.playAsync();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = (trackDuration: number) => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setProgressState((prev) => {
        if (prev >= trackDuration) {
          clearTimer();
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const play = useCallback((track: MediaTrack) => {
    clearTimer();
    setCurrentTrack(track);
    setDuration(track.durationSeconds);
    setProgressState(0);
    setIsPlaying(true);
    startTimer(track.durationSeconds);
  }, []);

  const pause = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (!currentTrack) return;
    setIsPlaying(true);
    startTimer(duration - progress);
  }, [currentTrack, duration, progress]);

  const stop = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
    setProgressState(0);
    setCurrentTrack(null);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else resume();
  }, [isPlaying, pause, resume]);

  const next = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const nextTrack = queue[idx + 1] ?? queue[0];
    if (nextTrack) play(nextTrack);
  }, [currentTrack, queue, play]);

  const previous = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const prevTrack = queue[idx - 1] ?? queue[queue.length - 1];
    if (prevTrack) play(prevTrack);
  }, [currentTrack, queue, play]);

  const setQueue = useCallback((tracks: MediaTrack[]) => {
    setQueueState(tracks);
  }, []);

  const setProgress = useCallback((p: number) => {
    setProgressState(p);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        queue,
        play,
        pause,
        resume,
        stop,
        next,
        previous,
        setQueue,
        setProgress,
        togglePlay,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
