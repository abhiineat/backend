import dotenv from "dotenv";
import connect from "./src/db/index.js";
dotenv.config();
import { app } from "./src/app.js";
 
connect()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
}
)
.catch((error) => {    
  console.log("mongodb connection failed", error);
}
);