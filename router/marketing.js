const express = require('express')
const SAPController = require("../Controllers/marketing");

const api = express.Router();

//Probar conexion
api.get("/sap", SAPController.connectMSSQL)

//Reportes
api.get("/consultafacturas", SAPController.ConsultaFacturas);
api.get("/reportepromociones", SAPController.ReportePromociones);
api.get("/categoriapromociones", SAPController.CategoriaPromociones);

//Exportar
api.get("/econsultafacturas", SAPController.ExportarConsultaFacturas);
api.get("/ereportepromociones",SAPController.ExportarReportePromociones);

module.exports = api;