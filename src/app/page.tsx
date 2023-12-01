"use client";

// use client

<meta name="viewport" content="width=device-width, initial-scale=1.0" /> // para el estilo app de movil

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faBookOpen } from '@fortawesome/free-solid-svg-icons';
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
    <main className={styles.title}>
      <h1>MedVox: tu calendario de medicamentos digital</h1>

      <a className={styles.boton1} href="/ingresar_tratamiento">
      <FontAwesomeIcon icon={faCalendarAlt} /> NUEVO TRATAMIENTO
      </a>
      
      <a className={styles.boton1} href="/calendario">
      <FontAwesomeIcon icon={faCalendarAlt} /> MI CALENDARIO
      </a>

      <a className={styles.boton1} href="/farmacopedia">
      <FontAwesomeIcon icon={faBookOpen} /> FARMACOPEDIA
      </a>

    </main>
  );
}
