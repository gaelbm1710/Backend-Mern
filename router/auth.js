const express = require("express");
const AuthController = require("../Controllers/auth");

const api = express.Router();

api.post("/auth/register", AuthController.register);
api.post("/auth/login", AuthController.login);
api.post("/auth/refresh_acces_token", AuthController.refreshAccesToken);

module.exports = api;