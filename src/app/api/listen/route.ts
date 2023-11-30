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
    return new Response("SIN AUDIO");
  }

  const { text } = await openai.audio.transcriptions.create({
    file: new File([file as File], "audio.ogg"),
    model: "whisper-1",
  });

  const {
    output: [, jsonText],
  } = spawnSync("python3", ["nlp.py", text]);

  if (jsonText === null) {
    return new Response("No output from nlp.py");
  }
  const drugInfo = JSON.parse(jsonText.toString());
  console.log("Generated JSON:", drugInfo);

  const {
      output: [, jsonCalendar],
    } = spawnSync("python3", ["funcion_calendario.py", jsonText]);
    
    if (!jsonCalendar || typeof jsonCalendar !== 'string') {
      return new Response("Invalid or empty output from funcion_calendario.py");
    }
    const calendarInfo = JSON.parse(jsonCalendar);
    console.log("Generated JSON:", calendarInfo);
    return new Response(JSON.stringify(calendarInfo));
};
