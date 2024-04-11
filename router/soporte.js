const express = require("express");
const SoporteController = require("../Controllers/soporte");
const multiparty = require("connect-multiparty");
const md_auth = require("../middlewares/authenticated");
const md_upload = multiparty({ uploadDir: "./uploads/soporte" })

const api = express.Router();

api.post("/soporte",[md_auth.asureAuth, md_upload], SoporteController.createSoporte);
api.get("/soporte",SoporteController.getSoporte)
api.patch("/soporte/:id",[md_auth.asureAuth, md_upload], SoporteController.updateSoporte);
api.delete("/soporte/:id",[md_auth.asureAuth],SoporteController.deleteTicket);

module.exports=api;