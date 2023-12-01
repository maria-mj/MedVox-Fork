"use client";

// use client

<meta name="viewport" content="width=device-width, initial-scale=1.0" />; // para el estilo app de movil

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
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

    recorder.current.onstop = async () => {
      const data = new FormData();
      data.append("file", new Blob(chunks, { type: "audio/ogg" }));
      const response = await fetch("/api/listen", {
        method: "POST",
        body: data,
      });

      const currentScheduleItem = localStorage.getItem("schedule");
      const currentSchedule = currentScheduleItem
        ? JSON.parse(currentScheduleItem)
        : {};

      const drugs = Object.entries<string[]>(await response.json()).reduce<
        Record<number, { drug: string; time: string }[]>
      >((acc, [drug, doses]) => {
        doses.forEach((dose) => {
          const day = new Date(dose).getDate();

          if (!acc[day]) {
            acc[day] = [];
          }

          acc[day].push({ drug, time: dose });
        });

        return acc;
      }, currentSchedule);

      localStorage.setItem("schedule", JSON.stringify(drugs));
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

  const handleClick = async () => {
    const response = await fetch("/api/send", {
      method: "POST",
      body: JSON.stringify(fields),
    });
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((value) => (stream.current = value));
  }, []);

  return (
    <main className={styles.title}>
      <h1>NUEVO TRATAMIENTO</h1>

      <div>
        <label>Medicamento:</label>
        <input
          value={fields.medicamento}
          onChange={handleChange("medicamento")}
          placeholder="Ingrese el nombre del medicamento "
        />
      </div>
      <div>
        <label>Frecuencia (horas):</label>
        <input
          value={fields.frecuencia_horas}
          onChange={handleChange("frecuencia_horas")}
          placeholder="Ingrese la frecuencia en horas "
        />
      </div>
      <div>
        <label>Duración (días):</label>
        <input
          value={fields.duracion_dias}
          onChange={handleChange("duracion_dias")}
          placeholder="Ingrese la duración en días "
        />
      </div>
      <div>
        <label>Primera dosis:</label>
        <input
          value={fields.primera_dosis}
          onChange={handleChange("primera_dosis")}
          placeholder="Ingrese la hora de la primera dosis "
        />
      </div>

      <button className={styles.boton1} onClick={handleClick}>
        <FontAwesomeIcon icon={faPaperPlane} /> ENVIAR
      </button>

      <button
        className={styles.boton1}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <FontAwesomeIcon icon={faMicrophone} />
      </button>
      {recording && <div>Escuchando...</div>}
    </main>
  );
}
