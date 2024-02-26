const express = require("express");
const PostController = require("../Controllers/post");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");
const md_upload = multiparty({ uploadDir:"./uploads/blog"});

const api = express.Router();

api.post("/post",[md_auth.asureAuth,md_upload],PostController.createPost);
api.get("/post",PostController.getPoste);
api.patch("/post/:id",[md_auth.asureAuth, md_upload],PostController.updatePost);
api.delete("/post/:id",[md_auth.asureAuth],PostController.deletePost);
api.get("/post/:path",PostController.getPost);

module.exports=api;
