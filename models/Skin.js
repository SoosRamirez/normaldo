const {Schema, model} = require("mongoose")

const Skin = new Schema({
    uniqueId: {type: String, unique: true, required: true},
    name: {type: String},
    skinRarity: {type: String},
    speed: {type: Number},
    size: {type: Number},
    appearanceMultiplier: {type: Number},
    itemsSpeedMultiplier: {type: Number},
    assets : [{type: String}]
})

module.exports = model('Skin', Skin)