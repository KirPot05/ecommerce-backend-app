import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  fetchAllOrders,
  fetchOrderInfo,
} from "../controllers/order.js";
import { body, param } from "express-validator";
import fetchUser from "../middleware/fetchUser.js";
import {
  addItems,
  fetchCartItems,
  removeCartItem,
  updateCartItem,
} from "../controllers/cart.js";

const router = Router();

router.post(
  "/add",
  fetchUser,
  [
    body("products")
      .exists()
      .isArray({ min: 1 })
      .withMessage("Products are required to add to cart"),
    body("address")
      .exists()
      .isObject()
      .withMessage("Delivery address is required to place order"),
  ],
  addItems
);

router.get("/", fetchUser, fetchCartItems);

router.patch(
  "/:id",
  fetchUser,
  [param("id").exists().isMongoId().withMessage("Not a valid id")],
  updateCartItem
);

router.delete(
  "/:id",
  fetchUser,
  [param("id").exists().isMongoId().withMessage("Not a valid id")],
  removeCartItem
);

export default router;
