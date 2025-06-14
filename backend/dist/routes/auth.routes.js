"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.get('/protected', auth_middleware_1.verifyToken, (req, res) => {
    res.json({ message: 'Acceso concedido solo con token válido' });
});
exports.default = router;
