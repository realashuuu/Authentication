import express from "express";
import authRouter from "./routes/auth.js";
import morgan from "morgan"; //It helps you monitor incoming requests and debug your application.
import cookieParser from "cookie-parser";

const app = express();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRouter);

export default app;

//methods
// app.use() = Registers middleware
// app.get() = Handles GET requests
// app.post() = Handles POST requests
// app.put() = Handles PUT requests
// app.delete() = Handles DELETE requests
// app.listen() = Starts an HTTP server
