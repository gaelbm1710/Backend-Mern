const express = require("express");
const MagController = require("../Controllers/magistrales");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();
//Investigación y Desarrollo
api.post("/mag",[md_auth.asureAuth], MagController.createMag);
api.get("/mag",MagController.getMag);
api.patch("/mag/:id",[md_auth.asureAuth], MagController.updateMagInyDe);
api.patch("/magi/:id",[md_auth.asureAuth], MagController.updateMagiInyDe);
api.patch("/magis/:id",[md_auth.asureAuth], MagController.updateMagisInyDe);
api.delete("/mag/:id",[md_auth.asureAuth],MagController.deleteMag);
api.get("/mag/cardcode/:cardcode",MagController.getMagbyCardcode);
api.get("/mag/asesor/:asesor",MagController.getMagbyAsesor);
api.get("/mag/actividad/:actividad",MagController.getMagbyActvidad);
api.get("/mags",MagController.getMagbyActvidadyAsesor);


//OPERACIONES
api.post("/ope",[md_auth.asureAuth], MagController.createMag);
api.get("/ope",MagController.getMag);
api.patch("/ope/:id",[md_auth.asureAuth], MagController.updateMagOpe);
api.patch("/opei/:id",[md_auth.asureAuth], MagController.updateMagiOpe);
api.patch("/opeis/:id",[md_auth.asureAuth], MagController.updateMagisOpe);
api.get("/ope/cardcode/:cardcode",MagController.getMagbyCardcode);
api.get("/ope/asesor/:asesor",MagController.getMagbyAsesor);
api.get("/ope/actividad/:actividad",MagController.getMagbyActvidad);
api.get("/opes",MagController.getMagbyActvidadyAsesor);


//Comercial o Marcela jejej :D
api.post("/come",[md_auth.asureAuth], MagController.createMag);
api.get("/come",MagController.getMag);
api.patch("/come/:id",[md_auth.asureAuth], MagController.updateMagCome);
api.patch("/comei/:id",[md_auth.asureAuth], MagController.updateMagiCome);
api.patch("/comeis/:id",[md_auth.asureAuth], MagController.updateMagisCome);
api.get("/come/cardcode/:cardcode",MagController.getMagbyCardcode);
api.get("/come/asesor/:asesor",MagController.getMagbyAsesor);
api.get("/come/asesor/:actividad",MagController.getMagbyActvidad);
api.get("/comes",MagController.getMagbyActvidadyAsesor);


module.exports=api;