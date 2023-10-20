"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
var User_1 = require("../models/User");
var Role_1 = require("../models/Role");
var bcrypt = __importStar(require("bcryptjs"));
var jwt = __importStar(require("jsonwebtoken"));
var express_validator_1 = require("express-validator");
var config_1 = require("../config");
var generateAccessToken = function (id, roles) {
    var payload = {
        id: id,
        roles: roles
    };
    return jwt.sign(payload, config_1.secret, { expiresIn: "24h" });
};
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.signup = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, _a, username, password, candidate, hashPassword, userRole, user, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ message: 'Signup error', errors: errors })];
                        }
                        _a = req.body, username = _a.username, password = _a.password;
                        return [4 /*yield*/, User_1.User.findOne({ username: username })];
                    case 1:
                        candidate = _b.sent();
                        if (candidate) {
                            return [2 /*return*/, res.status(400).json({ message: 'User with this username already exists' })];
                        }
                        hashPassword = bcrypt.hashSync(password, 10);
                        return [4 /*yield*/, Role_1.Role.findOne({ value: "ADMIN" })];
                    case 2:
                        userRole = _b.sent();
                        user = new User_1.User({ username: username, password: hashPassword, roles: [userRole.value] });
                        return [4 /*yield*/, user.save()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, res.json({ message: 'User created successfully' })];
                    case 4:
                        e_1 = _b.sent();
                        console.log(e_1);
                        return [2 /*return*/, res.status(400).json({ message: 'Signup error' })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, username, password, user, validPass, token, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, username = _a.username, password = _a.password;
                        return [4 /*yield*/, User_1.User.findOne({ username: username })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(400).json({ message: "Login error. User ".concat(username, " not found ") })];
                        }
                        validPass = bcrypt.compareSync(password, user.password);
                        if (!validPass) {
                            return [2 /*return*/, res.status(400).json({ message: "Login error. Wrong password" })];
                        }
                        token = generateAccessToken(user._id, user.roles);
                        return [2 /*return*/, res.json({ token: token })];
                    case 2:
                        e_2 = _b.sent();
                        console.log(e_2);
                        res.status(400).json({ message: 'Login error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.getUsers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var users, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, User_1.User.find()];
                    case 1:
                        users = _a.sent();
                        return [2 /*return*/, res.json(users)];
                    case 2:
                        e_3 = _a.sent();
                        console.log(e_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map