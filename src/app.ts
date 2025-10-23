import express from "express";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "https://david.local.dev:5173",
      "https://matuz.local.dev:3006",
      "https://192.168.1.205:3006",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use("/api", routes);

app.use(errorMiddleware);

export default app;
