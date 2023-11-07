import {Rarity, Skin} from "../models/Skin"
import {Request, Response} from "express"
import {validationResult} from "express-validator";


export class SkinsController {
    async getOneById(req: Request, res: Response) {
        try {
            const uniqueId = req.body
            const skin = await Skin.findOne({uniqueId})
            if (skin == null){
                return res.status(404).json({message:'skin not found'})
            }
            return res.json(skin)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'Error getting skin'})
        }

    }

    async getAll(req: Request, res: Response) {
        try {
            const skins = await Skin.find()
            return res.json(skins)
        } catch (e) {
            console.log(e)
            return res.status(500).json({errors: 'Server error'})
        }
    }

    async addSkin(req: Request, res: Response) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        try {
            const uniqueId = req.body.uniqueId
            if (await Skin.findOne({uniqueId: uniqueId})){
                return res.status(500).json({message: 'skin with this uniqueId already exists'})
            }
            const name = req.body.name
            const skinRarity = req.body.skinRarity
            if (!Object.values(Rarity).includes(skinRarity)){
                return res.status(500).json({message: 'wrong rarity value'})
            }
            const speed = req.body.speed
            const size = req.body.size
            const appearanceMultiplier = req.body.appearanceMultiplier
            const itemsSpeedMultiplier = req.body.itemsSpeedMultiplier
            const files = req.files
            const skin = new Skin({uniqueId: uniqueId,
                name: name,
                skinRarity: skinRarity,
                speed: speed,
                size: size,
                appearanceMultiplier: appearanceMultiplier,
                itemsSpeedMultiplier: itemsSpeedMultiplier,
                assets : {
                    skinny: files[0].path,
                    slim: files[1].path,
                    fat: files[2].path,
                    superFat: files[3].path,
                    skinnyBite: files[4].path,
                    slimBite: files[5].path,
                    fatBite: files[6].path,
                    superFatBite: files[7].path,
                    skinnyDead: files[8].path,
                }})
            await skin.save()
            console.log(`adding new skin ${name}`)
            return res.json('success')
        } catch (e) {
            console.log(e)
            return res.status(500).json({ errors: 'Could not add a skin' });
        }
    }
}
