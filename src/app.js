import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import passport from "passport";

import { initializePassport } from "./config/passport.config.js";

import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import usersRouter from "./routes/users.router.js";
import viewsRouter from "./routes/viewsRouter.js";

import __dirname from "./utils/constantsUtil.js";
import websocket from "./websocket.js";

const app = express();



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });



app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/../views`);
app.set("view engine", "handlebars");



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/../public`));


initializePassport();
app.use(passport.initialize());


app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
const io = new Server(httpServer);
websocket(io);
