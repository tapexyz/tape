import clsx from "clsx";
import React, { FC, useEffect, useRef, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { BsArrowRightShort } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

type Props = {
  selectPodUrl: string;
};

const AudioPlayer: FC<Props> = ({ selectPodUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioPlayer = useRef<HTMLAudioElement>(null);
  const progressBar = useRef<HTMLInputElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (audioPlayer.current && progressBar.current) {
      const seconds = Math.floor(audioPlayer.current.duration);
      setDuration(seconds | 0.0);
      progressBar.current.max = seconds.toString();
    }
  }, [
    audioPlayer?.current?.onloadedmetadata,
    audioPlayer?.current?.readyState,
  ]);

  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current?.play();
      togglePlayPause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    if (audioPlayer.current) {
      const prevValue = isPlaying;
      setIsPlaying(!prevValue);
      if (!prevValue) {
        audioPlayer.current.play();
        animationRef.current = requestAnimationFrame(whilePlaying);
      } else {
        audioPlayer.current.pause();
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const whilePlaying = () => {
    if (progressBar.current && audioPlayer.current) {
      progressBar.current.value = audioPlayer.current.currentTime.toString();
      changePlayerCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const changeRange = () => {
    if (progressBar.current && audioPlayer.current) {
      audioPlayer.current.currentTime = Number(progressBar.current.value);
      changePlayerCurrentTime();
    }
  };

  const changePlayerCurrentTime = () => {
    if (progressBar.current) {
      progressBar.current.style.setProperty(
        "--seek-before-width",
        `${(Number(progressBar.current.value) / duration) * 100}%`
      );
      setCurrentTime(Number(progressBar.current.value));
    }
  };

  const rewind = () => {
    if (progressBar.current) {
      progressBar.current.value = String(Number(progressBar.current.value) - 5);
      changeRange();
    }
  };

  const forward = () => {
    if (progressBar.current) {
      progressBar.current.value = String(Number(progressBar.current.value) + 5);
      changeRange();
    }
  };

  return (
    <div className="flex items-center flex-1">
      <audio ref={audioPlayer} src={selectPodUrl} preload="metadata"></audio>
      <button
        className="flex items-center p-1 text-sm rounded-full opacity-60 hover:opacity-100"
        onClick={rewind}
      >
        <BsArrowLeftShort /> 5
      </button>
      <button
        onClick={togglePlayPause}
        className="p-3 mx-4 text-white bg-black rounded-full dark:text-black dark:bg-white"
      >
        {isPlaying ? <FaPause /> : <FaPlay className={clsx("pl-1")} />}
      </button>
      <button
        className="flex items-center p-1 text-sm rounded-full opacity-60 hover:opacity-100"
        onClick={forward}
      >
        5 <BsArrowRightShort />
      </button>

      <div className="flex items-center w-full mx-3">
        <div className="mx-2">{calculateTime(currentTime)}</div>
        <div className="flex items-center w-full">
          <input
            type="range"
            className={clsx(
              "bg-gray-200 dark:bg-gray-800 h-1 w-full rounded-full"
            )}
            defaultValue="0"
            ref={progressBar}
            onChange={changeRange}
          />
        </div>
        <div className="mx-2">
          {duration && !isNaN(duration) && calculateTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
