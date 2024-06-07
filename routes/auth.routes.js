import { Router } from "express";
import {
  login,
  signup,
  updateUser,
  test,
} from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router
  .route("/login")
  .post(
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password can not be blank").isLength({ min: 8 }),
    login
  );

router.route("/signup").post(
  body("name", "Name must be of atleast 3 characters.").isLength({ min: 3 }),
  body("org", "Org must be of atleast 3 characters.").isLength({ min: 3 }),
  body("email", "Enter a valid Email").isEmail(),
  body("password", "Password must be of atleast 8 characters.").isLength({
    min: 8,
  }),
  signup
);

router.route("/updateUser/:id").put(verifyToken, updateUser);

router.route("/test").get(test);

export default router;
