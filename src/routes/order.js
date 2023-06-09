import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  fetchAllOrders,
  fetchOrderInfo,
} from "../controllers/order.js";
import { body, param } from "express-validator";
import fetchUser from "../middleware/fetchUser.js";

const router = Router();

router.post(
  "/orders/new",
  fetchUser,
  [
    body("userId").exists().isMongoId().withMessage("Invalid userId"),
    body("products")
      .exists()
      .isArray({ min: 1 })
      .withMessage("Products are required to place order"),
    body("amount")
      .exists()
      .isInt({ gt: 1 })
      .withMessage("Amount value greater than Rs.1 is required to place order"),
    body("address")
      .exists()
      .isObject()
      .withMessage("Delivery address is required to place order"),
  ],
  createOrder
);

router.get("/orders", fetchUser, fetchAllOrders);

router.get(
  "/orders/:id",
  fetchUser,
  [param("id").exists().isMongoId().withMessage("Not a valid id")],
  fetchOrderInfo
);

// router.patch(
//   "/orders/:id",
//   fetchUser,
//   [param("id").exists().isMongoId().withMessage("Not a valid id")],
//   editProduct
// );

router.patch(
  "/orders/:id/cancel",
  fetchUser,
  [param("id").exists().isMongoId().withMessage("Not a valid id")],
  cancelOrder
);

export default router;
