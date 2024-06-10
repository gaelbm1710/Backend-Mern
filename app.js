const express = require("express");
const bodyParser = require("body-parser");
const { API_VERSION } = require("./constants");
const cors = require("cors");
const app = express();
const path = require('path')
require('dotenv').config();


//Importar rutas
const authRoutes = require("./router/auth");
const userRoutes = require("./router/user");
const menuRoutes = require("./router/menu");
const courseRoutes = require("./router/course");
const postRoutes = require("./router/post");
const newsletterRoute = require("./router/newsletter");
const magistrales = require("./router/magistrales");
const contabilidad = require("./router/contabilidad");
const soporte = require("./router/soporte");
const sap = require("./router/informacionsap");

//Body-Parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//configurar uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//app.use(upload.array());

//Cors
app.use(cors());

//Configurar rutas
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, courseRoutes);
app.use(`/api/${API_VERSION}`, postRoutes);
app.use(`/api/${API_VERSION}`, newsletterRoute);
app.use(`/api/${API_VERSION}`, magistrales);
app.use(`/api/${API_VERSION}`, contabilidad);
app.use(`/api/${API_VERSION}`, soporte);
app.use(`/api/${API_VERSION}`, sap)

module.exports = app;

