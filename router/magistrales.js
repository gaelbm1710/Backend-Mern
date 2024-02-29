const express = require("express");
const MagController = require("../Controllers/magistrales");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/mag",[md_auth.asureAuth], MagController.createMag);
api.get("/mag",MagController.getMag);
api.patch("/mag/:id",[md_auth.asureAuth], MagController.updateMag);
api.delete("/mag/:id",[md_auth.asureAuth],MagController.deleteMag);
api.get("/mag/:cardcode",MagController.getMagi);

module.exports=api;