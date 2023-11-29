"use client";

import { useEffect, useRef, useState, useReducer, ChangeEvent } from "react";
import styles from "./page.module.css";

type Fields = {
  medicamento: string;
  frecuencia_horas: string;
  duracion_dias: string;
  primera_dosis: string;
};

const reducer = (state: Fields, payload: Partial<Fields>) => {
  return { ...state, ...payload };
};

export default function Home() {
  const [fields, setFields] = useReducer(reducer, {
    medicamento: "",
    frecuencia_horas: "",
    duracion_dias: "",
    primera_dosis: "",
  });
  const stream = useRef<MediaStream>();
  const [recording, setRecording] = useState(false);
  const recorder = useRef<MediaRecorder>();

  const handlePointerDown = () => {
    setRecording(true);
    const chunks: Blob[] = [];

    recorder.current = new MediaRecorder(stream.current as MediaStream);
    recorder.current.ondataavailable = (event) => chunks.push(event.data);

    recorder.current.onstop = () => {
      const data = new FormData();
      data.append("file", new Blob(chunks, { type: "audio/ogg" }));

      fetch("/api/listen", { method: "POST", body: data });
    };

    recorder.current.start();
  };

  const handlePointerUp = () => {
    setRecording(false);
    recorder.current?.stop();
  };

  const handleChange =
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setFields({ [field]: event.currentTarget.value });
    };

  const handleClick = () => {
    fetch("/api/send", { method: "POST", body: JSON.stringify(fields) });
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((value) => (stream.current = value));
  }, []);

  return (
    <main className={styles.main}>
      <input
        value={fields.medicamento}
        onChange={handleChange("medicamento")}
      />
      <input
        value={fields.frecuencia_horas}
        onChange={handleChange("frecuencia_horas")}
      />
      <input
        value={fields.duracion_dias}
        onChange={handleChange("duracion_dias")}
      />
      <input
        value={fields.primera_dosis}
        onChange={handleChange("primera_dosis")}
      />

      <button onClick={handleClick}>ENVIAR</button>

      <button onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
        GRABAR
      </button>
      {recording && <div>Escuchando...</div>}
    </main>
  );
}
