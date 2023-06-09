import express, { urlencoded, json } from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import productRoutes from "./routes/product.js";
import { NODE_ENV } from "./config/index.js";

export function startServer() {
  const app = express();

  app.use(cors());
  app.use(urlencoded({ extended: true }));

  if (NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.use(json());

  app.get("/", (req, res) => {
    res.send("Nothing found here");
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);

  return app;
}
