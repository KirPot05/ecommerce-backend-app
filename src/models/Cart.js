import { Schema, SchemaTypes, model } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },

    products: [
      {
        productId: {
          type: SchemaTypes.ObjectId,
          ref: "product",
        },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default model("cart", cartSchema);
