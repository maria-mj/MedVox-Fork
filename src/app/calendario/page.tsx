"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

const date = new Date();
const firstday = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

export default function Home() {
  const [render, setRender] = useState(false);

  useEffect(() => setRender(true), []);

  if (!render) {
    return null;
  }

  const item = localStorage.getItem("schedule");
  const schedule = item ? JSON.parse(item) : {};

  const days = Array.from({ length: 35 }, (_, index) => {
    const day = index - firstday + 2;
    
    return (
      <a href={`/calendario/${day}`} className={`${styles.day} ${day in schedule ? styles.drug : ""}`} key={index}>
        {" "}
        {index >= firstday - 1 ? day : ""}{" "}
      </a>
    );
  });

  return (
    <div className={styles.calendar}>
      <span className={styles.header}>L</span>
      <span className={styles.header}>M</span>
      <span className={styles.header}>X</span>
      <span className={styles.header}>J</span>
      <span className={styles.header}>V</span>
      <span className={styles.header}>S</span>
      <span className={styles.header}>D</span>
      {days}
    </div>
  );
}
