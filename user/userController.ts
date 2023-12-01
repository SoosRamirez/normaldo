import { Response } from "express";
import { User } from "../models/User";
import { IGetUserAuthInfoRequest } from "../interfaces/IgetUserAuthInfoRequest";
import { Skin } from "../models/Skin";
import creatEmail from "./userHelpers";

export class UserController {
  async getInfo(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user;
      const user = await User.findById(userId)
        .select({
          nickname: 1,
          dollars: 1,
          highScore: 1,
          extraLives: 1,
          level: 1,
          experience: 1,
          confirmed: 1,
          email: 1,
        })
        .lean();
      return res.status(200).json({ user: user });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Error getting info about user" });
    }
  }

  async sendVerifyEmail(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<Response> {
    try {
      await creatEmail(req, res, req.user);
      return res.send("An Email sent to your account please verify");
    } catch (error) {
      return res.status(400).send("An error occured");
    }
  }
  async obtainSkin(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user;
      const skinUniqueId = req.body.skinUniqueId;
      const skin = await Skin.findOne({ uniqueId: skinUniqueId });
      if (!skin) {
        return res.status(404).json({ message: "skin not found" });
      }
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { skins: skin.uniqueId } }
      );
      await user.save();
      return res.json({
        message: `skin ${skinUniqueId} obtained by ${user.nickname}`,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "error occurred" });
    }
  }
  async getObtained(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<Response> {
    try {
      const user = await User.findById(req.user);
      const skins = await Skin.find({ uniqueId: { $in: user.skins } });
      return res.json(skins);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "server error" });
    }
  }
  async updateUser(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { updates } = req.body;
      const user = await User.findByIdAndUpdate(req.user, { $set: updates });
      await user.save();
      const nUser = await User.findById(req.user)
        .select({'nickname': 1,
          'email': 1,
          'confirmed': 1,
          'roles': 1,
          'dollars': 1,
          'highScore': 1,
          'extraLives': 1,
          'level': 1,
          'experience': 1,
          'totalPizzas': 1,
          'skins': 1})
        .lean();
      return res.json({ message: "user successfully updated", user: nUser});
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "server error" });
    }
  }
}
