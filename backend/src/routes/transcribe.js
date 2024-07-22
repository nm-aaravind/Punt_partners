import express from "express"
const router = express.Router();
import { createClient } from "@deepgram/sdk";
import * as fs from "fs"
import { upload } from "../../config/multer.js";
import { generateAudio } from "../utils/convertToBuffer.js"

const deepgram = createClient(process.env.DG_API_KEY);

const getAudio = async (text) => {
    // STEP 2: Make a request and configure the request with options (such as model choice, audio configuration, etc.)
    const response = await deepgram.speak.request(
      { text },
      {
        model: "aura-asteria-en",
        encoding: "linear16",
        container: "wav",
      }
    );
    // STEP 3: Get the audio stream and headers from the responsez
    const stream = await response.getStream();
    const headers = await response.getHeaders();
    if (stream) {
      // STEP 4: Convert the stream to an audio buffer
      const buffer = await getAudioBuffer(stream);
      // STEP 5: Write the audio buffer to a file
      fs.writeFile("output.wav", buffer, (err) => {
        if (err) {
          console.error("Error writing audio to file:", err);
        } else {
          console.log("Audio file written to output.wav");
        }
      });
    } else {
      console.error("Error generating audio:", stream);
    }
  
    if (headers) {
      console.log("Headers:", headers);
    }
  };
  
  const getAudioBuffer = async (response) => {
    const reader = response.getReader();
    const chunks = [];
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
  
      chunks.push(value);
    }
  
    const dataArray = chunks.reduce(
      (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
      new Uint8Array(0)
    );
  
    return Buffer.from(dataArray.buffer);
  };

router.post("/textTranslate", upload.single('audio'), async (req, res) => {
    try {
        const audioBuffer = req.file.buffer;

        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            audioBuffer,
            {
                model: "nova-2",
                smart_format: true,
            }
        );
        const text = result.results.channels[0].alternatives[0].transcript;

        getAudio(text);


    } catch (error) {
        console.log(error)
    }
})
export default router;