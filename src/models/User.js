import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      uniqe: true,
    },

    email: { type: String, required: true, uniqe: true },

    password: { type: String, required: true },

    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("user", userSchema);
