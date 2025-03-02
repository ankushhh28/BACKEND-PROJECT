import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    //! mongoose gives as an object during connection
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MONGODB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
    //* it prints the connection host like localhost//:5000
  } catch (error) {
    console.log("MONGODB connection FAILED", error);
    process.exit(1);
    //! if some error happens then it instantly terminates the NODE.js
  }
};

export default connectDB;
