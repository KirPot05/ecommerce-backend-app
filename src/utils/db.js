import { connect } from "mongoose";
import { DB_URL } from "../config/index.js";

export async function connectDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await connect(DB_URL);
    // Send a ping to confirm a successful connection
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error(error);
  }
}
