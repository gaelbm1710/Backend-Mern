const express = require("express");
const multiparty = require("connect-multiparty");
const UserController = require("../Controllers/user");
const md_auth = require("../middlewares/authenticated");
const multer = require('multer');


const api = express.Router();
//const md_upload = multiparty({ uploadDir: "./uploads/avatar" })
const storage = multer.memoryStorage();
const upload = multer({ storage });

api.get("/user/me", [md_auth.asureAuth], UserController.getMe);
api.get("/users", [md_auth.asureAuth], UserController.getUsers);
api.post("/user", [md_auth.asureAuth, upload.single("avatar")], UserController.createUser);
api.patch("/user/:id", [md_auth.asureAuth, upload.single("avatar")], UserController.updateUser);
api.delete("/user/:id", [md_auth.asureAuth], UserController.deleteUser);
api.get("/user/:role", UserController.getAdmins);
api.get("/usersoporte/:role", UserController.getSistemas);
api.get("/userss", UserController.getUsers);
api.patch("/userr/:id", [md_auth.asureAuth, upload.single("avatar")], UserController.updateActive);
api.post("/create", upload.single("file"), UserController.uploadBlob);
api.get("/get/:container/:filename", UserController.getBlob);
api.get("/download/:container/:filename", UserController.getBlob)



module.exports = api;