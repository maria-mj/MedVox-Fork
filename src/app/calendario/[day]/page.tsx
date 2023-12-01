"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Day() {
  const [render, setRender] = useState(false);
  const params = useParams();

  useEffect(() => setRender(true), []);

  if (!render) {
    return null;
  }

  const item = JSON.parse(localStorage.getItem("schedule") || "");

  if (!item) {
    return null;
  }

  const day = params.day as string

  const drugs = item[day]

  return (
    <div>
      Estamos en el dia: {params.day} {JSON.stringify(drugs)}
    </div>
  );
}
