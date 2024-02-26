const Post = require("../models/post");
const image = require("../utils/image");

async function createPost(req, res) {
    try {
        const post = new Post(req.body);
        post.created_at = new Date();
        const imagePath = image.getFilePath(req.files.miniature);
        post.miniature = imagePath;
        const postStored = await post.save();
        res.status(200).send(postStored);
        //res.status(200).send({msg: "Post creado con Exito"});
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el post", error });
    }
}

async function getPoste(req, res) {
    const {page = 1, limit = 10} = req.query;
    const options = {
        page,
        limit: parseInt(limit),
    };
    Post.paginate({}, options, (error, posts)=> {
        if(error) {
            res.status(400).send({ msg: "Error al obtener la información", error });
        } else {
            res.status(200).send(posts);
        }
    });
}

async function updatePost(req, res) {
    try {
        const { id } = req.params;
        const postData = req.body;
        if (req.files.miniature) {
            const imagePath = image.getFilePath(req.files.miniature);
            postData.miniature = imagePath;
        }
        const updatePost = await Post.findByIdAndUpdate({ _id: id }, postData, { new: true });
        if (!updatePost) {
            res.status(404).send({ msg: "Post no encontrado" });
        } else {
            res.status(200).send({ msg: "Actualización exitosa"});
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar la información"});
        console.log(error);
    }
}

async function deletePost(req,res){
    const { id } = req.params;
    try{
        const deletePost = await Post.findByIdAndDelete(id);
        if(deletePost){
            res.status(200).send({msg: "Post eliminado"});
        }else{
            res.status(400).send({msg: "Post no encontrado"});
        }
    }catch (error){
        res.status(500).send({msg:"Error al eliminar el Post"});
    }
}

async function getPost(req, res) {
    try {
        const { path } = req.params;
        const postStored = await Post.findOne({ path });
        if (!postStored) {
            return res.status(404).send({ msg: "Post no encontrado" });
        }
        res.status(200).send(postStored);
    } catch (error) {
        console.error("Error al obtener el post:", error);
        res.status(500).send({ msg: "Error del servidor" });
    }
}



module.exports={
    createPost,
    getPoste,
    updatePost,
    deletePost,
    getPost,
}