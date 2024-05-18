import { useRef, useState } from "react";
import { useInterval } from "usehooks-ts";

export type AudioState = "playing" | "paused" | "stopped";

export function useGameAudioPlayer() {
  const audiosState = useRef<Record<string, AudioState>>({});
  const audios = useRef<Record<string, HTMLAudioElement>>({});
  const firstPlayedAt = useRef<Record<string, number>>({});
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  useInterval(() => {
    let isPlaying = false;
    for (const url in audios.current) {
      if (audiosState.current[url] == "playing") {
        isPlaying = true;
      }
    }
    setPlaying(isPlaying);
  }, 500);

  function createAudio(url: string, loop = true) {
    const audio = new Audio(url);
    audio.loop = loop;
    audio.volume = 0.5;
    audios.current[url] = audio;

    audio.onpause = () => {
      if (audio.ended) return;
      audiosState.current[url] = "paused";
      setPaused(true);
    };

    audio.onplaying = () => {
      audiosState.current[url] = "playing";
      setPaused(false);
    };

    audio.onended = () => {
      audiosState.current[url] = "stopped";
    };

    return audio;
  }

  function playAudio(url: string, loop = true, resetTime = false) {
    let audio: HTMLAudioElement;

    if (!audios.current[url]) {
      audio = createAudio(url, loop);
    } else {
      audio = audios.current[url];
      if (audiosState.current[url] === "playing") {
        audio.currentTime = resetTime ? 0 : audio.currentTime;
        audio.loop = loop;
        return;
      }
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
    }
  }

  function pauseAudio(url: string) {
    if (audios.current[url]) {
      setPaused(true);
      audios.current[url].pause();
      audiosState.current[url] = "paused";
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
    paused,
    playing,
    isFirstPlay,
  };
}
