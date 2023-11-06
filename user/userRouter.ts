import {Router} from "express"
import {UserController} from "./userController";
import authMiddleware from "../middlewares/authMiddleware";
const router = Router();

const controller = new UserController()

router.get('/info', authMiddleware, controller.getInfo)
router.get('/sendVerifyEmail', authMiddleware, controller.sendVerifyEmail)
router.get('/verify/:id/:token', controller.verify)

export default router