import {Schema, model} from "mongoose"

const TokenSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
})

export const Token = model('Token', TokenSchema)
