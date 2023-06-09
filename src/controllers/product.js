import { validationResult } from "express-validator";
import { failed_response, success_response } from "../utils/response.js";
import ProductModel from "../models/Product.js";
import UserModel from "../models/User.js";
import { ALLOWED_PRODUCT_FIELDS } from "../utils/constants.js";

export async function createProduct(req, res) {
  if (!req.isAdmin) {
    return res.status(403).json(failed_response(403, "Unauthorized Operation"));
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(failed_response(400, "Something went wrong", errors.array()));
  }

  try {
    const productFields = Object.keys(req.body);

    for (let field of productFields) {
      if (!ALLOWED_PRODUCT_FIELDS.includes(field)) {
        return res.json(failed_response(400, ` [${field}] - Invalid field`));
      }
    }

    const product = await ProductModel.create(req.body);

    return res
      .status(201)
      .json(success_response(201, "Product successfully added", product));
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(failed_response(500, "Internal server error"));
  }
}

export async function editProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(failed_response(400, errors.array().at(0).msg, errors.array()));
  }

  const productId = req.params.id;
  const userId = req.user_id;

  try {
    if (!req.isAmin || String(userId).trim() === "") {
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

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json(failed_response(400, "No fields to edit"));
    }

    const fieldsToEdit = Object.keys(req.body);

    for (let field of fieldsToEdit) {
      if (!ALLOWED_PRODUCT_FIELDS.includes(field)) {
        return res.json(failed_response(400, ` [${field}] - Invalid field`));
      }
    }

    await ProductModel.findByIdAndUpdate(
      productId,
      { ...req.body },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(success_response(200, "Successfully updated product-info"));
  } catch (error) {
    console.error(error.message);
    return res.json(failed_response(500, "Internal server error"));
  }
}

export async function fetchProductInfo(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(failed_response(400, errors.array().at(0).msg, errors.array()));
  }

  const productId = req.params.id;

  try {
    const product = await ProductModel.findById(productId);

    return res
      .status(200)
      .json(success_response(200, "Successfully fetched product", product));
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(failed_response(500, "Internal server error"));
  }
}

// Remainder - Apply pagination to products
export async function fetchAllProducts(req, res) {
  try {
    const products = await ProductModel.find();

    return res
      .status(200)
      .json(success_response(200, "Successfully fetched products", products));
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(failed_response(500, "Internal server error"));
  }
}

export async function deleteProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(failed_response(400, errors.array().at(0).msg, errors.array()));
  }

  const productId = req.params.id;

  try {
    if (!req.isAmin) {
      return res
        .status(403)
        .json(failed_response(403, "Unauthorized Operation"));
    }

    await ProductModel.findByIdAndDelete(productId);

    return res
      .status(200)
      .json(success_response(200, "Successfully deleted product"));
  } catch (error) {
    console.error(error.message);
    return res.json(failed_response(500, "Internal server error"));
  }
}
