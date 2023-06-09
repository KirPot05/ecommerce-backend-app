import { validationResult } from "express-validator";
import { failed_response, success_response } from "../utils/response.js";
import OrderModel from "../models/Order.js";
import UserModel from "../models/User.js";
import {
  ALLOWED_ORDER_FIELDS,
  ALLOWED_PRODUCT_FIELDS,
} from "../utils/constants.js";

export async function createOrder(req, res) {
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

    const orderData = {
      userId,
      products: req.body.products,
      amount: req.body.amount,
      address: req.body.address,
    };
    const order = await OrderModel.create(orderData);

    return res
      .status(201)
      .json(success_response(201, "Order placed successfully", order));
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(failed_response(500, "Internal server error"));
  }
}

export async function editOrder(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(failed_response(400, errors.array().at(0).msg, errors.array()));
  }

  const orderId = req.params.id;
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

    const fieldsToEdit = Object.keys(req.body);

    for (let field of fieldsToEdit) {
      if (!ALLOWED_ORDER_FIELDS.includes(field)) {
        return res.json(failed_response(400, ` [${field}] - Invalid field`));
      }
    }

    await OrderModel.findByIdAndUpdate(
      orderId,
      { ...req.body },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(success_response(200, "Successfully updated order-info"));
  } catch (error) {
    console.error(error.message);
    return res.json(failed_response(500, "Internal server error"));
  }
}

export async function fetchOrderInfo(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(failed_response(400, errors.array().at(0).msg, errors.array()));
  }

  const orderId = req.params.id;
  const userId = req.user_id;

  try {
    const order = await OrderModel.findById(orderId);

    if (!req.isAdmin && order?.userId !== userId) {
      return res
        .status(403)
        .json(failed_response(403, "Unauthorized access to service"));
    }

    return res
      .status(200)
      .json(success_response(200, "Successfully fetched order info", order));
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(failed_response(500, "Internal server error"));
  }
}

// Remainder - Apply pagination to products
export async function fetchAllOrders(req, res) {
  const userId = req.user_id;
  try {
    let orders = [];

    const user = await UserModel.findById(userId);

    if (!req.isAdmin && user === null) {
      return res
        .status(403)
        .json(failed_response(403, "Unauthorized operation"));
    }

    if (req.isAdmin) {
      orders = await OrderModel.find();
    } else {
      orders = await OrderModel.find({ userId });
    }

    return res
      .status(200)
      .json(success_response(200, "Successfully fetched orders", orders));
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(failed_response(500, "Internal server error"));
  }
}

export async function cancelOrder(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(failed_response(400, errors.array().at(0).msg, errors.array()));
  }

  const orderId = req.params.id;
  const userId = req.user_id;

  try {
    const order = await OrderModel.findById(orderId);

    if (!req.isAdmin && order?.userId !== userId) {
      return res
        .status(403)
        .json(failed_response(403, "Unauthorized access to service"));
    }

    await OrderModel.findByIdAndUpdate(orderId, {
      status: "cancelled",
    });

    return res.status(200).json(success_response(200, "Order cancelled"));
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(failed_response(500, "Internal server error"));
  }
}
