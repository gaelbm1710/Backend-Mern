const express = require("express");
const ContaController = require("../Controllers/contabilidad")

const api = express.Router();

api.get("/conta", ContaController.getReporteKeyla);
api.get("/credito", ContaController.getReporteTranscredito);
api.get("/creditos", ContaController.getClientesCredito);
api.get("/pagos", ContaController.getPagosFacturas);
//Filtros de Fechas
api.get("/contar", ContaController.getReporteKeylaFechas);
api.get("/creditor", ContaController.getReporteTranscreditoFechas);
api.get("/pagar", ContaController.getPagosFacturasFechas)
//Reportes
api.get("/econta", ContaController.ExportReporteKeyla);
api.get("/ecredito", ContaController.ExportReporteTransaccionesCredito);
api.get("/epagos", ContaController.ExportPagosFacturas);
//Consultas sin limites
api.get("/contas", ContaController.getReporteK);
api.get("/creditoss", ContaController.getReporteT);
api.get("/pagosf", ContaController.getPF);

module.exports = api;