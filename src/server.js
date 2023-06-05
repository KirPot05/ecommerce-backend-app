import express, { urlencoded, json } from "express";
import cors from "cors";

export function startServer() {
  const app = express();

  app.use(cors());
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.get("/", (req, res) => {
    res.send("Nothing found here");
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/ingredients", ingredientRoutes);
  app.use("/api/order", orderRoutes);

  return app;
}
