const express = require("express");
const ContaController = require("../Controllers/contabilidad")

const api = express.Router();

api.get("/conta",ContaController.getReporteKeyla);
api.get("/contas",ContaController.getReporteK);
api.get("/credito",ContaController.getReporteTranscredito);
api.get("/creditos",ContaController.getClientesCredito);
api.get("/pagos",ContaController.getPagosFacturas);


module.exports=api;