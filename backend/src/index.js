import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import "dotenv/config"
try {
    await mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING)
    console.log("Connected to db")
} catch (error) {
    console.log(error)
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        credentials: true,
        preflightContinue: true,
        methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        origin: process.env.FRONTEND_URL
    }
));

app.listen(process.env.PORT, () => {
    console.log("Hello from express", process.env.PORT)
})

app.get("/", async (req, res) => {
    res.send("Server is running")
})

export default app