import * as crypto from "crypto"

export const secret = crypto.randomBytes(48).toString('hex')