"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// Ruta solo para admin
router.get('/admin', auth_middleware_1.verifyToken, (0, role_middleware_1.verifyRole)(['admin']), (req, res) => {
    console.log('✅ Acceso correcto como ADMIN');
    res.json({ message: 'Bienvenido administrador' });
});
// Ruta solo para capacitador
router.get('/capacitador', auth_middleware_1.verifyToken, (0, role_middleware_1.verifyRole)(['capacitador']), (req, res) => {
    console.log('✅ Acceso correcto como CAPACITADOR');
    res.json({ message: 'Bienvenido capacitador' });
});
// Ruta accesible por admin o capacitador
router.get('/privado', auth_middleware_1.verifyToken, (0, role_middleware_1.verifyRole)(['admin', 'capacitador']), (req, res) => {
    var _a;
    const rol = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    console.log(`✅ Acceso correcto como ${rol === null || rol === void 0 ? void 0 : rol.toUpperCase()}`);
    res.json({ message: `Hola ${rol}, puedes ver esta ruta privada` });
});
// Ruta para cualquier usuario logueado
router.get('/normal', auth_middleware_1.verifyToken, (req, res) => {
    console.log('✅ Acceso como usuario logueado (cualquier rol)');
    res.json({ message: 'Bienvenido, usuario con token válido' });
});
exports.default = router;
