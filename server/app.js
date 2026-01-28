import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connection } from "./database/dbConnection.js";
import errorMiddleware from "./middlewares/error.js";
import userRouter from './routes/userRouter.js'
import {removeUnverifiedAccounts} from "./automation/removeUnverifiedAccounts.js";

config({path: "./config.env"});
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "PUT", "POST", "DELETE"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user",userRouter);
removeUnverifiedAccounts();
connection();
app.use(errorMiddleware)

export default app;