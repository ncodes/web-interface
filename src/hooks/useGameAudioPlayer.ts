import { useEffect, useRef, useState } from "react";

export type AudioState = "playing" | "paused" | "stopped";

export function useGameAudioPlayer() {
  const audiosState = useRef<Record<string, AudioState>>({});
  const audios = useRef<Record<string, HTMLAudioElement>>({});
  const firstPlayedAt = useRef<Record<string, number>>({});
  const [updatedAt, setUpdatedAt] = useState(Date.now());
  const [playing, setPlaying] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);

  useEffect(() => {
    let isPlaying = false;
    for (const url in audios.current) {
      if (audiosState.current[url] == "playing") {
        isPlaying = true;
      }
    }
    setPlaying(isPlaying);
  }, [updatedAt]);

  function createAudio(url: string, loop = true) {
    const audio = new Audio(url);
    audio.loop = loop;
    audio.volume = 0.5;
    audios.current[url] = audio;

    audio.onpause = () => {
      audiosState.current[url] = "paused";
      setManualPaused(true);
      setUpdatedAt(Date.now());
    };

    audio.onplaying = () => {
      audiosState.current[url] = "playing";
      setManualPaused(false);
      setUpdatedAt(Date.now());
    };

    audio.onended = () => {
      audiosState.current[url] = "stopped";
      setUpdatedAt(Date.now());
    };

    return audio;
  }

  function playAudio(url: string, loop = true, resetTime = false) {
    let audio: HTMLAudioElement;

    if (!audios.current[url]) {
      audio = createAudio(url, loop);
    } else {
      audio = audios.current[url];
      audio.currentTime = resetTime ? 0 : audio.currentTime;
      audio.pause();
      audio.loop = loop;
      setManualPaused(false);
    }

    audio.play();
    audios.current[url] = audio;

    if (!firstPlayedAt[url]) firstPlayedAt[url] = Date.now();
  }

  function stopAudio(url: string) {
    if (audios.current[url]) {
      audios.current[url].pause();
      audios.current[url].currentTime = 0;
      audiosState.current[url] = "stopped";
      setUpdatedAt(Date.now());
    }
  }

  function pauseAudio(url: string) {
    if (audios.current[url]) {
      setManualPaused(true);
      audios.current[url].pause();
      audiosState.current[url] = "paused";
      setUpdatedAt(Date.now());
    }
  }

  function getAudios() {
    return Object.keys(audios);
  }

  function isFirstPlay(url: string) {
    return !firstPlayedAt[url];
  }

  return {
    createAudio,
    playAudio,
    stopAudio,
    pauseAudio,
    getAudios,
    audiosState,
    manualPaused,
    playing,
    isFirstPlay,
    updatedAt,
  };
}
