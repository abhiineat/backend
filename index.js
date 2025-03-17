import dotenv from "dotenv";
import connect from "./src/db/index.js";
dotenv.config();

connect()
.then(() => {
  console.log(`MongoDB connected on port ${process.env.PORT}`);
}
)
.catch((error) => {    
  console.log("mongodb connection failed", error);
}
);