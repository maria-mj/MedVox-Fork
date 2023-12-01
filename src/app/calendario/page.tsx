"use client";

import styles from "./page.module.css";

const date = new Date()
const firstday = new Date(date.getFullYear(),date.getMonth(),1).getDay()
const days = Array.from({length: 35}, (_,index) => <span key={index}> {index} </span>)
export default function Home() {
  
  return (
        <div className={styles.calendar}> {days}  </div>
  );
}
