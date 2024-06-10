import { Router } from "express"
import {
  getUser,
  updateUser,
  createUser,
  // deleteUser,
} from "../controllers/user.controller.js"
import { body } from "express-validator"
import { verifyToken } from "../middleware/verifyToken.js"

const router = Router()

router.route("/getUser").get(verifyToken, getUser)

router.route("/createUser").post(
  body("name", "Name must be of atleast 3 characters.").isLength({ min: 3 }),
  body("org", "Org must be of atleast 3 characters.").isLength({ min: 3 }),
  verifyToken,
  createUser
)
router.route("/updateUser/:id").put(verifyToken, updateUser)

export default router
