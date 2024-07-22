import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import "dotenv/config"
import transcribeRouter from './routes/transcribe.js'
import { upload } from '../config/multer.js'
import { createClient } from "@deepgram/sdk";
// import * as fs from "fs"

// const deepgram = createClient(process.env.DG_API_KEY);

// try {
//     await mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING)
//     console.log("Connected to db")
// } catch (error) {
//     console.log(error)
// }

const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors(
//     {
//         credentials: true,
//         preflightContinue: true,
//         methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
//         origin: process.env.FRONTEND_URL
//     }
// ));
// // app.use("/api",transcribeRouter)
// app.listen(process.env.PORT, () => {
//     console.log("Hello from express", process.env.PORT)
// })

// app.get("/", async (req, res) => {
//     res.send("Server is running")
// })

// const getAudio = async (text) => {
//     // STEP 2: Make a request and configure the request with options (such as model choice, audio configuration, etc.)
//     const response = await deepgram.speak.request(
//       { text },
//       {
//         model: "aura-asteria-en",
//         encoding: "linear16",
//         container: "wav",
//       }
//     );
//     // STEP 3: Get the audio stream and headers from the response
//     const stream = await response.getStream();
//     const headers = await response.getHeaders();
//     if (stream) {
//       // STEP 4: Convert the stream to an audio buffer
//       const buffer = await getAudioBuffer(stream);
//       // STEP 5: Write the audio buffer to a file
//       fs.writeFile("output.wav", buffer, (err) => {
//         if (err) {
//           console.error("Error writing audio to file:", err);
//         } else {
//           console.log("Audio file written to output.wav");
//         }
//       });
//     } else {
//       console.error("Error generating audio:", stream);
//     }
  
//     if (headers) {
//       console.log("Headers:", headers);
//     }
//   };
  
//   // helper function to convert stream to audio buffer
//   const getAudioBuffer = async (response) => {
//     const reader = response.getReader();
//     const chunks = [];
  
//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;
  
//       chunks.push(value);
//     }
  
//     const dataArray = chunks.reduce(
//       (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
//       new Uint8Array(0)
//     );
  
//     return Buffer.from(dataArray.buffer);
//   };

// app.post("/api/textTranslate", upload.single('audio'), async (req, res) => {
//     try {
//         const audioBuffer = req.file.buffer;

//         const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
//             audioBuffer,
//             {
//                 model: "nova-2",
//                 smart_format: true,
//             }
//         );
//         const text = result.results.channels[0].alternatives[0].transcript;

//         getAudio(text);


//     } catch (error) {
//         console.log(error)
//     }
// })
// export default app
// const express = require('express');
// const env = require('dotenv');
// const cors = require('cors');
// const multer = require('multer');
// const fs = require("fs");
// const app = express();
// env.config();
app.use(cors());
app.use(express.json());

// const { createClient } = require("@deepgram/sdk");

// const { get } = require('http');

const deepgram = createClient(process.env.DG_API_KEY);
const transcribeFile = async (file) => {  
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    // path to the audio file
    file,
    {
      model: "nova-2",
      smart_format: true,
    }
  );

  if (error) throw error;
  // STEP 4: Print the results
  if (!error) return result.results.channels[0].alternatives[0].transcript;
};



const getAudio = async (transtext) => {

  const response = await deepgram.speak.request(
    { text :transtext},
    {
      model: "aura-asteria-en",
      encoding: "linear16",
      container: "wav",
    }
  );
  const stream = response.getStream();
  console.log(stream, "STREAM")
  const headers = response.getHeaders();
  if (stream) {
    // STEP 4: Convert the stream to an audio buffer
    const buffer = await getAudioBuffer(response);
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

// helper function to convert stream to audio buffer
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

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

app.post("/api/textTranslate", upload.single("audio"), async (req, res) => {
  try {
    const text = await transcribeFile(req.file.buffer);
    console.log(text);
    getAudio(text);
    res.json({ result: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});