const express = require("express");
const ContaController = require("../Controllers/contabilidad")

const api = express.Router();

api.get("/conta",ContaController.getReporteKeyla);
api.get("/contas",ContaController.getReporteK);



module.exports=api;