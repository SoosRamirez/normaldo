import {Schema, model} from "mongoose"


const SkinSchema = new Schema({
    uniqueId: {type: String, unique: true, required: true},
    name: {type: String},
    skinRarity: {type: String},
    speed: {type: Number},
    size: {type: Number},
    appearanceMultiplier: {type: Number},
    itemsSpeedMultiplier: {type: Number},
    assets : {
        skinny: { type: String, required: true },
        slim: { type: String, required: true },
        fat: { type: String, required: true },
        superFat: { type: String, required: true },
        skinnyBite: { type: String, required: true },
        slimBite: { type: String, required: true },
        fatBite: { type: String, required: true },
        superFatBite: { type: String, required: true },
        skinnyDead: { type: String, required: true },
    },
    soundAssets : {
        bite: {type: String, required: true},
    }
})

export const Skin = model('Skin', SkinSchema)
