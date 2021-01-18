import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const metas = [
  { "src": "mp3/kobza-kolyadka.mp3", from: 19.4, till: 56.4, silence: 2, speed: 1 },
  { "src": "mp3/siple-snig.mp3", from: 19.4, till: 56.4, silence: 2, speed: 1 },
];

function App() {

  const meta = metas[0];

  const audioRef = useRef<HTMLAudioElement>(null);
  const src = meta.src;
  const [isLoop, setIsLoop] = useState(true);
  const [from, setFrom] = useState(meta.from);
  const [till, setTill] = useState(meta.till);
  const [silence, setSilence] = useState(meta.silence);
  const [speed, setSpeed] = useState(meta.speed);

  const audio = audioRef && audioRef.current;

  // const audio = document.querySelector("audio");
  // const button = document.querySelector("button");
  // const inputLoop = document.querySelector("[name=loop]");
  // const inputFrom = document.querySelector("[name=time-from]");
  // const inputTill = document.querySelector("[name=time-till]");
  // const inputSilence = document.querySelector("[name=time-silence]");
  // const inputRatio = document.querySelector("[name=ratio]");

  useEffect(() => {
    if (audio) {
      console.log("audio", audio);

      const listener = () => {
        console.log(audio.currentTime + " / " + audio.duration);
      };

      audio.addEventListener("timeupdate", listener);

      return () => {
        audio.removeEventListener("timeupdate", listener);
      };
    }
  }, [audio]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  const handleChangeLoop = useCallback(() => {
    setIsLoop(loop => !loop);
  }, []);

  const handlePlayPause = useCallback(() => {
    // updateConf();
    // const config = readConfig();

    if (audioRef && audioRef.current) {
      if (audioRef.current.paused) {
        // aud.currentTime = config.timeFrom;
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, []);

  return (
    <div>
      <div>
        <audio src={src} loop controls ref={audioRef} />
      </div>
      <div style={{ margin: "5px 0 0 0" }}>
        <label>
          <input type="checkbox" name="loop" checked={isLoop} onChange={handleChangeLoop} />
          loop
        </label>
      </div>
      <div style={{ margin: "5px 0 0 0" }}>
        <input name="time-from" type="number" step="0.1" value={from} onChange={(e) => {
          setFrom(parseFloat(e.target.value));
        }} /> from
      </div>
      <div style={{ margin: "5px 0 0 0" }}>
        <input name="time-till" type="number" step="0.1" value={till} onChange={(e) => {
          setTill(parseFloat(e.target.value));
        }} /> till
      </div>
      <div style={{ margin: "5px 0 0 0" }}>
        <input name="time-silence" type="number" step="0.1" value={silence} onChange={(e) => {
          setSilence(parseFloat(e.target.value));
        }} /> silence
      </div>
      <div style={{ margin: "5px 0 0 0" }}>
        <input name="ratio" type="number" step="0.01" value={speed} onChange={(e) => {
          setSpeed(parseFloat(e.target.value));
        }} /> speed
      </div>
      <div style={{ margin: "5px 0 0 0" }}>
        <button type="button" onClick={handlePlayPause}>Play/Pause</button>
      </div>
    </div>
  );
}

export default App;
