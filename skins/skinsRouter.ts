import {Router} from "express"
import {SkinsController} from "./skinsController"
import {skinValidator} from "../middlewares/validators"
import upload from "../middlewares/multer";

const router = Router();

const controller = new SkinsController();

router.get('/oneById', controller.getOneById)
router.get('/getAll', controller.getAll)
router.post('/addSkin', upload.array("assets"), skinValidator, controller.addSkin)
export default router