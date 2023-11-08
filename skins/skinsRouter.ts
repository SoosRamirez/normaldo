import {Router} from "express"
import {SkinsController} from "./skinsController"
import {skinValidator} from "../middlewares/validators"
import upload from "../middlewares/multer";
import {roleMiddleware} from "../middlewares/roleMiddleware";

const router = Router();

const controller = new SkinsController();

router.get('/getOneById', controller.getOneById)
router.get('/getAll', controller.getAll)
router.post('/addSkin', roleMiddleware(['ADMIN']), upload.array("assets"), skinValidator, controller.addSkin)
export default router