import {check} from "express-validator";

export const skinValidator = [
    check('uniqueId').notEmpty(),
    check('name').notEmpty(),
    check('skinRarity').notEmpty(),
    check('speed', "speed is empty").notEmpty(),
    check('size', "size is empty").notEmpty(),
    check('appearanceMultiplier', "appearanceMultiplier is empty").notEmpty(),
    check('itemsSpeedMultiplier', "itemsSpeedMultiplier is empty").notEmpty(),
    check('files').custom((value, { req }) => {
        if (req.files.length < 9) {
            throw new Error(`Needed 9, got ${req.files.length}`);
        }
        return true;
    }),
]

export const authValidator = [
    check('nickname', "nickname is empty").notEmpty(),
    check('password', "password must be more than 6 symbols").isLength({min: 6}),
    check('email', "email is required").notEmpty().isEmail()
]