"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_model_1 = require("../models/user.model");
const jwt_service_1 = require("../services/jwt.service");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, rut, password } = req.body;
        const exists = yield user_model_1.User.findOne({ $or: [{ email }, { rut }] });
        if (exists) {
            res.status(400).json({ message: 'Email o RUT ya en uso' });
            return;
        }
        const user = new user_model_1.User({ email, username, rut, password });
        yield user.save();
        const token = (0, jwt_service_1.generateToken)({ id: user._id, role: user.role });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                email,
                username,
                rut,
                role: user.role,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        if (!user || !(yield user.comparePassword(password))) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }
        const token = (0, jwt_service_1.generateToken)({ id: user._id, role: user.role });
        res.json({
            token,
            user: {
                id: user._id,
                email,
                username: user.username,
                rut: user.rut,
                role: user.role,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});
exports.login = login;
