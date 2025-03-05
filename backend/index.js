import express from "express";
import { PORT, MONGO_URI } from "./config.js";
const app = express()
import mongoose from 'mongoose';



mongoose.connect(MONGO_URI).then(() => {
    console.log("connected to mongo")


    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
}).catch((error) => {
    console.log(error)
})