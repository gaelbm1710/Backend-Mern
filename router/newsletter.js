const express = require("express");
const NewsletterController = require("../Controllers/newsletter");
const md_auth = require("../middlewares/authenticated");
const api = express.Router();

api.post("/newsletter",NewsletterController.suscribeEmail);
api.get("/newsletter",NewsletterController.getEmail);
api.delete("/newsletter/:id",[md_auth.asureAuth], NewsletterController.deleteEmail)

module.exports=api;