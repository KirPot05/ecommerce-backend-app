import { Router } from "express";
import {
  createUser,
  editUser,
  fetchAllUsers,
  fetchUserInfo,
  userLogin,
} from "../controllers/auth.js";
import { body } from "express-validator";
import fetchUser from "../middleware/fetchUser.js";

const router = Router();

router.post("/login", [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  userLogin,
]);

router.post(
  "/create",
  [
    body("userName").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  createUser
);

router.get("/users", fetchUser, fetchAllUsers);

router.get("/users/:id", fetchUser, fetchUserInfo);

router.patch("/users/:id", fetchUser, editUser);

export default router;
