const Skin = require("../models/Skin")

class SkinsController {
    async getOneById(req, res){
        try{
            const uniqueId = req.body
            const skin = await Skin.findOne({uniqueId})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Error getting skin'})
        }

    }
    async getAll(req, res){
        try {
            const skins = await Skin.find()
            res.json(skins)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new SkinsController()