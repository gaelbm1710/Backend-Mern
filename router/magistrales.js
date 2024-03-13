const express = require("express");
const MagController = require("../Controllers/magistrales");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();
//Investigación y Desarrollo
api.post("/mag",[md_auth.asureAuth], MagController.createMag);
api.get("/mag",MagController.getMag);
api.patch("/mag/:id",[md_auth.asureAuth], MagController.updateMag);
api.delete("/mag/:id",[md_auth.asureAuth],MagController.deleteMag);
api.get("/mag/:cardcode",MagController.getMagbyCardcode);
api.get("/mag/:asesor",MagController.getMagbyAsesor);

//OPERACIONES
api.post("/ope",[md_auth.asureAuth], MagController.createMag);
api.get("/ope",MagController.getMag);
api.patch("/ope/:id",[md_auth.asureAuth], MagController.updateMag);
api.delete("/ope/:id",[md_auth.asureAuth],MagController.deleteMag);
api.get("/ope/:cardcode",MagController.getMagbyCardcode);
api.get("/ope/:asesor",MagController.getMagbyAsesor);

//Comercial o Marcela jejej :D
api.post("/come",[md_auth.asureAuth], MagController.createMag);
api.get("/come",MagController.getMag);
api.patch("/come/:id",[md_auth.asureAuth], MagController.updateMag);
api.delete("/come/:id",[md_auth.asureAuth],MagController.deleteMag);
api.get("/come/:cardcode",MagController.getMagbyCardcode);
api.get("/come/:asesor",MagController.getMagbyAsesor);

module.exports=api;