import "dotenv/config";
//! no need to give path in dotenv as it is in the root directory
import connectDB from "./db/index.js";
import app from "./app.js";

//! Database imported....
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MONGODB connection failed!!! ${error}`);
  });

/* I way of connecting DATABASE...

import express from "express";
const app = express();
//! IIFE expression for function call
(async () => {
  try {
    //! DATABASE connectivity
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

    //* Yeh code event listener set kar raha hai jo "Error" event ko listen karega. Jab bhi "Error" event trigger hoga, yeh function execute hoga aur error ko console me print karke throw kar dega.

    app.on("Error", (error) => {
      console.log("App ERROR: ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.eventNames.PORT}`);
    });
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
})();
*/
