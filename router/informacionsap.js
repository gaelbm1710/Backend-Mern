const express = require('express')
const SAPController = require("../Controllers/infromacionsap");

const api = express.Router();

//Probar conexion
api.get("/sap", SAPController.connectMSSQL)


module.exports = api;