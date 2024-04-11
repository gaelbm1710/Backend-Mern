const express = require("express");
const bodyParser = require("body-parser");
const {API_VERSION} = require("./constants");
const cors = require("cors");
const app = express();

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

//Body-Parse
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//configurar uploads
app.use(express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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

module.exports = app;

