import express from "express";
import dotenv from "dotenv";
import connect from "./src/db/index.js";
dotenv.config();
const app = express();
connect();