const Router = require("express")
const controller = require("./authController")
const {check} = require("express-validator")
const router = new Router();
const roleMiddleware = require("./middlewares/roleMiddleware")

router.post('/signup',[
    check('username', "username is empty").notEmpty(),
    check('password', "password must be more than 6 symbols").isLength({min:6})
], controller.signup)
router.post('/login', controller.login)
router.get('/users',roleMiddleware("ADMIN") , controller.getUsers)

module.exports = router