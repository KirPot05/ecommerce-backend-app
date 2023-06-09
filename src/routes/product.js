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
  "/new",
  fetchUser,
  [
    body("title").isLength({ min: 3 }),
    body("description").exists().isLength({ min: 5 }),
    body("img").exists(),
    body("price").exists(),
  ],
  createProduct
);

router.get("/", fetchAllProducts);

router.get(
  "/:id",
  [param("id").exists().isMongoId().withMessage("Not a valid id")],
  fetchProductInfo
);

router.patch(
  "/:id",
  fetchUser,
  [param("id").exists().isMongoId().withMessage("Not a valid id")],
  editProduct
);

router.delete(
  "/:id",
  fetchUser,
  [param("id").exists().isMongoId().withMessage("Not a valid id")],
  deleteProduct
);

export default router;
