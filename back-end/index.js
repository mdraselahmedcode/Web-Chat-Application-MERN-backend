// index.js
import express, { json } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';
import cors from 'cors';
import {app, server} from './socket/socket.js';



dotenv.config();

const PORT = process.env.PORT || 5000;


// middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

const corsOption = {
    // origin: 'http://localhost:3000',
    origin: ['http://localhost:3000',],
    credentials: true
}
app.use(cors(corsOption));

// routes
app.use("/api/v1/user", userRoute); 
app.use("/api/v1/message", messageRoute);

// Connect to the database and then start the server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Database connection failed', error);
    process.exit(1); // Exit the process with failure
});