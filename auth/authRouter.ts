import {Router} from "express"
import {AuthController} from "./authController"
import {authValidator} from "../middlewares/validators";

const router = Router();

const controller = new AuthController()

router.post('/signup', authValidator, controller.signup)
router.post('/login', controller.login)
router.get('/verify/:id/:token', controller.verifyEmail)


export default router