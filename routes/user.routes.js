import { Router } from "express"
import {
  getUser,
  updateUser,
} from "../controllers/user.controller.js"
import { body } from "express-validator"
import { verifyToken } from "../middleware/verifyToken.js"

const router = Router()

router
  .route("/getUser")
  .get(
    verifyToken,
    getUser
  )

// router.route("/signup").post(
//   body("name", "Name must be of atleast 3 characters.").isLength({ min: 3 }),
//   body("org", "Org must be of atleast 3 characters.").isLength({ min: 3 }),
//   body("email", "Enter a valid Email").isEmail(),
//   body("password", "Password must be of atleast 8 characters.").isLength({
//     min: 8,
//   }),
//   signup
// )

router.route("/updateUser/:id").put(verifyToken, updateUser)


export default router
