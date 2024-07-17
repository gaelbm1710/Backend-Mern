const express = require("express");
const MagController = require("../Controllers/magistrales");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();
//Investigación y Desarrollo
api.post("/mag", [md_auth.asureAuth], MagController.createMag);
api.get("/mag", MagController.getMag);
api.patch("/mag/:id", [md_auth.asureAuth], MagController.updateMagInyDe);
api.patch("/magi/:id", [md_auth.asureAuth], MagController.updateMagiInyDe);
api.patch("/magis/:id", [md_auth.asureAuth], MagController.updateMagisInyDe);
api.delete("/mag/:id", [md_auth.asureAuth], MagController.deleteMag);
api.get("/mag/cardcode/:cardcode", MagController.getMagbyCardcode);
api.get("/mag/asesor/:asesor", MagController.getMagbyAsesor);
api.get("/magi", MagController.getMagbyActvidad);
api.get("/mags", MagController.getMagbyActvidadyAsesor);
api.patch("/savemag/:id", [md_auth.asureAuth], MagController.saveMagIyD);
api.patch("/savemagi/:id", [md_auth.asureAuth], MagController.saveMagiInyDe);
api.patch("/savemagis/:id", [md_auth.asureAuth], MagController.saveMagisInyDe);

//OPERACIONES
api.post("/ope", [md_auth.asureAuth], MagController.createMag);
api.get("/ope", MagController.getMag);
api.patch("/ope/:id", [md_auth.asureAuth], MagController.updateMagOpe);
api.patch("/opei/:id", [md_auth.asureAuth], MagController.updateMagiOpe);
api.patch("/opeis/:id", [md_auth.asureAuth], MagController.updateMagisOpe);
api.get("/ope/cardcode/:cardcode", MagController.getMagbyCardcode);
api.get("/ope/asesor/:asesor", MagController.getMagbyAsesor);
api.get("/opei", MagController.getMagbyActvidad);
api.get("/opes", MagController.getMagbyActvidadyAsesor);
api.patch("/saveope/:id", [md_auth.asureAuth], MagController.saveMagOpe);
api.patch("/saveopei/:id", [md_auth.asureAuth], MagController.saveMagiOpe);
api.patch("/saveopeis/:id", [md_auth.asureAuth], MagController.saveMagisOpe);


//Comercial o Marcela jejej :D
api.post("/come", [md_auth.asureAuth], MagController.createMag);
api.get("/come", MagController.getMag);
api.patch("/come/:id", [md_auth.asureAuth], MagController.updateMagCome);
api.patch("/comei/:id", [md_auth.asureAuth], MagController.updateMagiCome);
api.patch("/comeis/:id", [md_auth.asureAuth], MagController.updateMagisCome);
api.get("/come/cardcode/:cardcode", MagController.getMagbyCardcode);
api.get("/come/asesor/:asesor", MagController.getMagbyAsesor);
api.get("/comei", MagController.getMagbyActvidad);
api.get("/comes", MagController.getMagbyActvidadyAsesor);
api.patch("/savecome/:id", [md_auth.asureAuth], MagController.saveMagCome);
api.patch("/savecomei/:id", [md_auth.asureAuth], MagController.saveMagiCome);
api.patch("/savecomeis/:id", [md_auth.asureAuth], MagController.saveMagisCome);

//Cancelación
api.patch("/mag/cancelacion/:id", [md_auth.asureAuth], MagController.canceleMag);

//Actualizar Mag
api.patch("/mag/actualizar/:id", [md_auth.asureAuth], MagController.updateMag);

//Envases
api.get("/envases", MagController.envases);


module.exports = api;