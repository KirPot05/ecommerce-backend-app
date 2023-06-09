import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
  fetchProductInfo,
} from "../controllers/product.js";
import { body, param } from "express-validator";
import fetchUser from "../middleware/fetchUser.js";

const router = Router();

router.post(
  "/orders/new",
  fetchUser,
  [
    body("title").isLength({ min: 3 }),
    body("description").exists().isLength({ min: 5 }),
    body("img").exists(),
    body("price").exists(),
  ],
  createProduct
);

router.get("/products", fetchAllProducts);

router.get(
  "/products/:id",
  [param("id").exists().isMongoId().withMessage("Not a valid id")],
  fetchProductInfo
);

router.patch(
  "/products/:id",
  fetchUser,
  [param("id").exists().isMongoId().withMessage("Not a valid id")],
  editProduct
);

router.delete(
  "/products/:id",
  fetchUser,
  [param("id").exists().isMongoId().withMessage("Not a valid id")],
  deleteProduct
);

export default router;
