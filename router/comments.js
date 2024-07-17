const express = require('express')
const CommentsController = require("../Controllers/comments")
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

//Comentarios
api.post("/comments", [md_auth.asureAuth], CommentsController.createCommentario);
api.get("/comments", CommentsController.getComentarios);
api.patch("/comments/:id", [md_auth.asureAuth], CommentsController.updateComentario);
//reply
api.patch("/comments/:id/reply", [md_auth.asureAuth], CommentsController.addReply);

//Feedback
api.post("/feedback", [md_auth.asureAuth], CommentsController.createFeedback)

module.exports = api;