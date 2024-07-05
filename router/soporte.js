const express = require("express");
const SoporteController = require("../Controllers/soporte");
const multiparty = require("connect-multiparty");
const md_auth = require("../middlewares/authenticated");
//const md_upload = multiparty({ uploadDir: "./uploads/soporte" })
const multer = require('multer');

const api = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

api.post("/soporte", [md_auth.asureAuth], SoporteController.createSoporte);
api.get("/soporte", SoporteController.getSoporte)
api.patch("/soporte/:id", [md_auth.asureAuth], SoporteController.updateSoporte);
api.delete("/soporte/:id", [md_auth.asureAuth], SoporteController.deleteTicket);

//Ticket con Azure
api.post("/asoporte", [md_auth.asureAuth, upload.single("documentos")], SoporteController.createSoporteconAzure);
api.get("/asoporte", SoporteController.getSoprteconAzure);

//Cancelar Ticket
api.patch("/soporte/cancelar/:id", [md_auth.asureAuth], SoporteController.cancelTicket);

//Buscar por dueno
api.get("/soportes/:dueno", SoporteController.getUsuarioSoporte);

module.exports = api;