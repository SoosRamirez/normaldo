"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController_1 = require("./authController");
var express_validator_1 = require("express-validator");
var router = (0, express_1.Router)();
var controller = new authController_1.AuthController();
router.post('/signup', [
    (0, express_validator_1.check)('username', "username is empty").notEmpty(),
    (0, express_validator_1.check)('password', "password must be more than 6 symbols").isLength({ min: 6 })
], controller.signup);
router.post('/login', controller.login);
router.get('/users', controller.getUsers);
// , roleMiddleware(["ADMIN"])
exports.default = router;
//# sourceMappingURL=authRouter.js.map