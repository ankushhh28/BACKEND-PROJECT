import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//! Enable cors for connection with frontend
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    //*  Sirf specific origin (frontend ka URL) se requests allow karega
    credentials: true,
    //* Cookies aur authentication headers allow karega
  })
);

app.use(express.json({ limit: "16kb" }));
//* ye Request body(jo frontend se aayegi) ko JSON format me parse karta hai

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//* Yeh middleware URL-encoded data ko parse karta hai
//* extended: true → Yeh batata hai ki nested objects aur arrays ko support karna hai ya nahi

app.use(express.static("public"));
//* refer notes....

// app.use(cookieParser());
//* refer notes....

//! routes importing......
import router from "./routes/user.routes.js";

//! routes declaration...
//* url format=> https://localhost:8000/api/v1/users/route_name
app.use("/api/v1/users", router);

export { app };
