const Router = require("express")
const controller = require("./skinsController")
const router = new Router();

router.get('/oneById', controller.getOneById)
router.get('/getAll', controller.getAll)
module.exports = router