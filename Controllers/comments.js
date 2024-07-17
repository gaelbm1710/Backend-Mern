const Comment = require("../models/comments");

//Comentarios 
async function createCommentario(req, res) {
    try {
        const comentario = new Comment(req.body);
        const comentarioStored = await comentario.save();
        res.status(200).send({ msg: "Comentario Creado", comentarioStored })
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el comentario" });
    }
}

async function addReply(req, res) {
    try {
        const comentarioId = req.params.id;
        const reply = req.body;
        const comentario = await Comment.findById(comentarioId);
        if (!comentario) {
            return res.status(404).send({ msg: "Comentario no encontrado" });
        }
        comentario.replies.push(reply);
        const comentarioUpdated = await comentario.save();
        res.status(200).send({ msg: "Respuesta creada", comentarioUpdated });
    } catch (error) {
        res.status(400).send({ msg: "Error al crear la respuesta" });
    }
}

async function getComentarios(req, res) {
    const { page = 1, limit = 10 } = req.query;
    try {
        const comentarios = await Comment.paginate({}, { page, limit });
        res.status(200).send(comentarios);
    } catch (error) {
        res.status(400).send({ msg: "Error al obtener los comentarios" });
    }
}

async function updateComentario(req, res) {
    try {
        const comentarioId = req.params.id;
        const comentarioUpdated = await Comment.findByIdAndUpdate(comentarioId, req.body, { new: true });
        res.status(200).send({ msg: "Comentario Actualizado", comentarioUpdated });
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar el comentario" });
    }
}

//Feedback

async function createFeedback(req, res) {
    try {
        const comentario = new Comment(req.body);
        const comentarioStored = await comentario.save();
        res.status(200).send({ msg: "Comentario Creado", comentarioStored })
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el comentario" });
    }
}



module.exports = {
    createCommentario,
    getComentarios,
    updateComentario,
    addReply,
    createFeedback
}