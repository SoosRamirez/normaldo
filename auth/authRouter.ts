import {Router} from "express"
import {AuthController} from "./authController"
import {check} from "express-validator"

const router = Router();

const controller = new AuthController()

router.post('/signup', [
    check('username', "username is empty").notEmpty(),
    check('password', "password must be more than 6 symbols").isLength({min: 6}),
    check('email', "email is required").notEmpty().isEmail()
], controller.signup)
router.post('/login', controller.login)
router.get('/verify/:id/:token', controller.verify)


export default router