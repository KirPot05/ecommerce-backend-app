import { Schema, SchemaTypes, model } from "mongoose";

const orderSchema = new Schema(
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

    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "shipped",
        "delivered",
        "cancelled",
        "out-for-delivery",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model("order", orderSchema);
