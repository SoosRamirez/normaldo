import {Schema, model} from "mongoose"

const UserSchema = new Schema({
    nickname: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    confirmed: {type: Boolean, default: false},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'Role'}],
    dollars: {type: Number, default: 0},
    highScore: {type: Number, default: 0},
    extraLives: {type: Number, default: 0},
    level: {type: Number, default: 0},
    experience: {type: Number, default: 0},
    totalPizzas: {type: Number, default: 0},
    skins: [{type: String, ref: 'Skin'}]
})

export const User = model('User', UserSchema)