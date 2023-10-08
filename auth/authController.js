const User = require("../models/User")
const Role = require("../models/Role")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const { secret } = require("../config")

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class AuthController {
    async signup(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Signup error', errors})
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: 'User with this username already exists'})
            }
            const hashPassword = bcrypt.hashSync(password, 10)
            const userRole = await Role.findOne({value: "ADMIN"})
            const user = new User({username, password: hashPassword, roles: [userRole.value]})
            await user.save()
            return res.json({message: 'User created successfully'})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Signup error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `Login error. User ${username} not found `})
            }
            const validPass = bcrypt.compareSync(password, user.password)
            if (!validPass) {
                return res.status(400).json({message: `Login error. Wrong password`})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new AuthController()