import OpenAI from "openai";
import { spawnSync } from "child_process";

const openai = new OpenAI({
  apiKey: "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",
  organization: "org-ZPHfBCaW6nEpB9612H4Sxa0p",
});

export const POST = async (request: Request) => {
  const data = await request.formData();
  const file = data.get("file");

  if (!file) {
    return new Response("SIN AUDIO WEY");
  }

  const { text } = await openai.audio.transcriptions.create({
    file: new File([file as File], "audio.ogg"),
    model: "whisper-1",
  });

  const {
    output: [, json],
  } = spawnSync("python3", ["nlp.py", text]);

 /* const {
    output: [, result],
  } = spawnSync("python3", ["nlp-2.py", json?.toString()]);
*/

  return new Response(json);
}; 

/* [
  ["fecha", "recomendacion"],
  ["2023-12-1"],
  { fecha: "fecha", recomendacion: "etc" },
]; */
