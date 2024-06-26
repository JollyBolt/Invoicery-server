import { Router } from "express"
import { getStats } from "../controllers/stat.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = Router()

router.get("/getstats", verifyToken, getStats)

export default router