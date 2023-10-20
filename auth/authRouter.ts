import {Router} from "express"
import {AuthController} from "./authController"
import {check} from "express-validator"

const router = Router();
import {roleMiddleware} from "../middlewares/roleMiddleware"

const controller = new AuthController()

router.post('/signup', [
    check('username', "username is empty").notEmpty(),
    check('password', "password must be more than 6 symbols").isLength({min: 6})
], controller.signup)
router.post('/login', controller.login)
router.get('/users', controller.getUsers)

export default router