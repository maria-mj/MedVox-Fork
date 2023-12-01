"use client";

import styles from "./page.module.css";

const date = new Date()
const firstday = new Date(date.getFullYear(),date.getMonth(),1).getDay()
const days = Array.from({length: 35}, (_,index) =>  <span className={styles.day} key={index}> {index >= firstday - 1? index - firstday +2:""} </span>)
export default function Home() {
  
  return (
        <div className={styles.calendar}> 
            <span className={styles.day}>L</span>
            <span className={styles.day}>M</span>
            <span className={styles.day}>X</span>
            <span className={styles.day}>J</span>
            <span className={styles.day}>V</span>
            <span className={styles.day}>S</span>
            <span className={styles.day}>D</span>
            {days}  
        </div>
  );
}
