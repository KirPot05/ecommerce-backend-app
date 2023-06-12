import { validationResult } from "express-validator";
import { failed_response, success_response } from "../utils/response.js";
import CartModel from "../models/Cart.js";
import UserModel from "../models/User.js";

export async function addItems(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(failed_response(400, "Something went wrong", errors.array()));
  }

  const userId = req.user_id;

  try {
    if (String(userId).trim() === "") {
      return res
        .status(403)
        .json(failed_response(403, "Unauthorized Operation"));
    }

    const user = await UserModel.findById(userId);
    if (user === null) {
      return res
        .status(403)
        .json(failed_response(403, "Operation not allowed"));
    }

    const userCart = await CartModel.findOne({ userId });
    if (userCart !== null) {
      await CartModel.updateOne(
        { userId },
        {
          $push: { products: { ...req.body.products } },
        }
      );

      return res
        .status(201)
        .json(success_response(201, "Added products to cart"));
    }

    const cart = await CartModel.create({
      userId,
      products: req.body.products,
    });

    return res
      .status(201)
      .json(success_response(201, "Items added to cart successfully", cart));
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(failed_response(500, "Internal server error"));
  }
}

// Update cart items - update quantity - for efficiency we can add only one controller for all updates to the cart
export async function updateCartItem(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(failed_response(400, errors.array().at(0).msg, errors.array()));
  }

  const productId = req.params.id;
  const userId = req.user_id;

  try {
    const user = await UserModel.findById(userId);

    if (user === null && !req.isAdmin) {
      return res
        .status(403)
        .json(failed_response(403, "Operation not allowed"));
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json(failed_response(400, "No fields to edit"));
    }

    if (
      Object.keys(req.body).length > 1 ||
      !Object.keys(req.body).includes("quantity")
    ) {
      return res
        .status(400)
        .json(
          failed_response(
            400,
            "Only quantity of item is allowed for modification"
          )
        );
    }

    await CartModel.updateOne(
      { userId, "products.productId": productId },
      {
        $set: { "products.$.quantity": req.body.quantity },
      }
    );

    return res
      .status(200)
      .json(success_response(200, "Successfully updated cart"));
  } catch (error) {
    console.error(error.message);
    return res.json(failed_response(500, "Internal server error"));
  }
}

// Remainder - Apply pagination to cart items
export async function fetchCartItems(req, res) {
  const userId = req.user_id;
  try {
    const user = await UserModel.findById(userId);

    if (!req.isAdmin && user === null) {
      return res
        .status(403)
        .json(failed_response(403, "Unauthorized operation"));
    }

    const cartItems = await CartModel.find({ userId });

    return res
      .status(200)
      .json(
        success_response(200, "Successfully fetched cart items", cartItems)
      );
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(failed_response(500, "Internal server error"));
  }
}

export async function removeCartItem(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(failed_response(400, errors.array().at(0).msg, errors.array()));
  }

  const productId = req.params.id;
  const userId = req.user_id;

  try {
    const user = await UserModel.findById(userId);

    if (!req.isAdmin && user === null) {
      return res
        .status(403)
        .json(failed_response(403, "Unauthorized access to service"));
    }

    await CartModel.updateOne(
      {
        userId,
        "products.productId": productId,
      },
      { $pull: { products: { productId } } }
    );

    return res
      .status(200)
      .json(success_response(200, "Item removed from cart successfully"));
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(failed_response(500, "Internal server error"));
  }
}
