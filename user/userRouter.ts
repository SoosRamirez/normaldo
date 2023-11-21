import {Router} from "express"
import {UserController} from "./userController";
const router = Router();

const controller = new UserController()

router.get('/info', controller.getInfo)
router.get('/sendVerifyEmail', controller.sendVerifyEmail)
router.post('/obtainSkin', controller.obtainSkin)
router.get('/getObtained', controller.getObtained)
router.put('/updateUser', controller.updateUser)

export default router