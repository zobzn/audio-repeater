import React, { useCallback, useEffect, useState } from "react";
import { useAudio } from "react-use";
import "./App.css";

const metas = [
  { "src": "mp3/tse-zima.mp3", from: 12.8, till: 67.2, silence: 2, speed: 0.9 },
  { "src": "mp3/kobza-kolyadka.mp3", from: 0, till: 29.4, silence: 2, speed: 1 },
  { "src": "mp3/siple-snig.mp3", from: 19.4, till: 56.4, silence: 2, speed: 1 },
];

function App() {
  const minDuration = 2;
  const [src, setSrc] = useState(metas[0].src);
  const [from, setFrom] = useState(0);
  const [till, setTill] = useState(0);
  const [silence, setSilence] = useState(2);
  const [speed, setSpeed] = useState(1);

  const [audio, state, controls, audioRef] = useAudio({
    style: { width: "100%" },
    autoPlay: true,
    controls: false,
    // controlsList?: string;
    // crossOrigin?: string;
    loop: true,
    // mediaGroup?: string;
    muted: false,
    playsInline: true,
    // preload?: string;
    src,
  });

  const {
    time, duration, paused,
    // muted, volume
  } = state;

  useEffect(() => {
    const meta = metas.find(meta => meta.src === src);
    if (meta && duration) {
      setFrom(meta.from || 0);
      setTill(meta.till || duration);
      controls.seek(meta.from || 0);
      controls.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, src]);

  useEffect(() => {
    console.log({ duration, time });
  }, [time, duration]);

  useEffect(() => {
    if (from > time) {
      controls.seek(from);
      controls.play();
    }
  }, [time, duration, from, controls]);

  useEffect(() => {
    if (time > till) {
      controls.pause();
      controls.seek(from);
      setTimeout(() => {
        controls.play();
      }, silence * 1000);
    }
  }, [controls, from, silence, till, time]);


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [audioRef, speed]);

  const handleSetFrom = useCallback((fromRaw) => {
    const newFrom = Math.max(0, Math.min(duration - minDuration, Math.max(0, fromRaw)));
    const newTill = Math.min(duration, Math.max(newFrom + 2, till, 0));
    const newTime = newFrom;
    setFrom(newFrom);
    setTill(newTill);
    controls.seek(newTime);
    controls.play();
  }, [controls, duration, till]);

  const handleSetTill = useCallback((tillRaw) => {
    const newFrom = Math.max(0, Math.min(from, tillRaw - minDuration));
    const newTill = Math.min(duration, Math.max(minDuration, tillRaw));
    const newTime = Math.max(from, newTill - 2);
    setFrom(newFrom);
    setTill(newTill);
    controls.seek(newTime);
    controls.play();
  }, [controls, duration, from]);

  const handleSetTime = useCallback((timeRaw) => {
    const newTime = Math.max(from, Math.min(till, timeRaw));
    controls.seek(newTime);
    controls.play();
  }, [controls, from, till]);

  // const audio = document.querySelector("audio");
  // const button = document.querySelector("button");
  // const inputLoop = document.querySelector("[name=loop]");
  // const inputFrom = document.querySelector("[name=time-from]");
  // const inputTill = document.querySelector("[name=time-till]");
  // const inputSilence = document.querySelector("[name=time-silence]");
  // const inputRatio = document.querySelector("[name=ratio]");

  const handleGoToStart = useCallback(() => {
    controls.seek(from);
    controls.play();
  }, [controls, from]);

  const handleGoToEnd = useCallback(() => {
    controls.seek(till - minDuration);
    controls.play();
  }, [controls, till]);

  const handlePlayPause = useCallback(() => {
    if (paused) {
      controls.play();
    } else {
      controls.pause();
    }
  }, [controls, paused]);

  return (
    <div style={{ margin: "1em" }}>
      <div>
        <select value={src} onChange={(e) => setSrc(e.target.value)}>
          {metas.map(meta => (<option key={meta.src} value={meta.src}>{meta.src}</option>))}
        </select>
      </div>
      <div style={{ margin: "10px 0 0 0" }}>
        {audio}
      </div>
      <div style={{ margin: "5px 0 0 0" }}>
        <div>Time: {duration} - {("" + Math.round((time + Number.EPSILON) * 100) / 100)}</div>
        <input type="range" min={0} max={duration} value={time} step={0.1} style={{ width: "100%" }}
               onChange={(e) => handleSetTime(parseFloat(e.target.value || "0"))} />
      </div>
      <div style={{ margin: "5px 0 0 0" }}>
        <div>От: {from}</div>
        <input type="range" min={0} max={duration} value={from} step={0.1} style={{ width: "100%" }}
               onChange={(e) => handleSetFrom(parseFloat(e.target.value || "0"))} />
      </div>
      <div style={{ margin: "5px 0 0 0" }}>
        <div>До: {till}</div>
        <input type="range" min={0} max={duration} value={till} step={0.1} style={{ width: "100%" }}
               onChange={(e) => handleSetTill(parseFloat(e.target.value || `${duration || 0}`))} />
      </div>
      <div style={{ margin: "5px 0 0 0" }}>
        <div>Пауза: {silence}</div>
        <input type="range" min={0.1} max={5} value={silence} step={0.1} style={{ width: "100%" }}
               onChange={(e) => setSilence(parseFloat(e.target.value))} />
      </div>
      <div style={{ margin: "5px 0 0 0" }}>
        <div>Скорость: {speed}</div>
        <input type="range" min={0.1} max={3} value={speed} step={0.05} style={{ width: "100%" }}
               onChange={(e) => setSpeed(parseFloat(e.target.value))} />
      </div>
      <div style={{ margin: "5px 0 0 0", display: "flex", gap: "10px" }}>
        <button type="button" onClick={handleGoToStart}>В начало</button>
        <button type="button" onClick={handleGoToEnd}>В конец</button>
        <button type="button" onClick={handlePlayPause}>{paused ? "Запустить" : "Приостановить"}</button>
      </div>
    </div>
  );
}

export default App;
