import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import chatRoutes from "./routes/chatRoutes.js";
import rideMatchingRoutes from "./routes/rideMatching.Routes.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json()); 
app.use(cookieParser());

// app.use(cors());

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};
app.use(cors(corsOptions));


connectDB();

app.use('/api/auth', userRoutes);

app.use('/api/rides',rideRoutes);

app.use("/api/rides", rideMatchingRoutes);
app.use("/api/messages", chatRoutes);

app.get("/", (req, res) => {
  console.log("Home");
  res.status(200).json({ message: "Welcome to the Chat App API!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);