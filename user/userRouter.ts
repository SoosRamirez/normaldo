import {Router} from "express"
import {UserController} from "./userController";
import {roleMiddleware} from "../middlewares/roleMiddleware";
const router = Router();

const controller = new UserController()

router.get('/info', controller.getInfo)
router.get('/sendVerifyEmail', controller.sendVerifyEmail)
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)

export default router