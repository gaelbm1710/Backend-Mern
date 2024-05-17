const { response } = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const image = require("../utils/image");
const sendgrid = require('@sendgrid/mail');
const { Almacenamiento, AlmacenamientoCompartido, Apisendgrind, Email, Autorizacion } = require("../constants")
//const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

//const blobService = BlobServiceClient.fromConnectionString(Almacenamiento);
//const storageService = new StorageSharedKeyCredential("kaapaproduction", AlmacenamientoCompartido);

async function getMe(req, res) {
    const { user_id } = req.user;
    const response = await User.findById(user_id);
    if (!response) {
        res.status(400).send({ msg: "No se ha encontrado usuario" });
    } else {
        res.status(200).send(response);
    }
}

async function getUsers(req, res) {
    const { active } = req.query;
    let response = null;

    if (active === undefined) {
        response = await User.find();
    } else {
        response = await User.find({ active })
    }
    //console.log(response);

    res.status(200).send(response);
}

async function getAdmins(req, res) {
    const { role } = req.query;
    let query = {};
    if (active != undefined) {
        query.role = role;
    }
    try {
        const response = await User.find(query);
        //console.log(response);
        res.status(200).send(response);
    } catch (error) {
        console.error("Error al obtener usuarios", error);
        res.status(500).send({ msg: "Errror al obtener usuarios" })
    }
}

async function createUser(req, res) {
    const { password } = req.body;
    const user = new User({ ...req.body, active: false });
    const salt = bcrypt.genSaltSync(10);
    const hasPassword = bcrypt.hashSync(password, salt);
    user.password = hasPassword;

    if (req.files.avatar) {
        const imagePath = image.getFilePath(req.files.avatar);
        user.avatar = imagePath;
    }
    /*
    const containerName = "usuarios";
    const filePath = req.files.avatar.path;
    const blobName = `usuarios${filePath}`;
    async function uploadFile() {
        const containerCliente = blobService.getContainerClient(containerName);
        await containerCliente.createIfNotExists();
        const blockBlobCliente = containerCliente.getBlockBlobClient(blobName);
        await blockBlobCliente.uploadFile(filePath);
        console.log("Archivo subido a Azure");
    }
    uploadFile().catch((error) => {
        console.error("Error al subir el archivo a Azure: ", error);
    })
    */
    const saveUser = async (error, userStored) => {
        try {
            await user.save();
            res.status(201).send({ msg: "Usuario Creado", userStored });
        } catch (error) {
            res.status(400).send({ msg: "Error al crear usuario" });
            console.log(error);
        }
    }
    saveUser();
}

async function updateUser(req, res) {
    const { id } = req.params;
    console.log(req.params);
    const userData = req.body;
    console.log(userData);
    console.log(req.body);
    if (userData.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(userData.password, salt);
        userData.password = hashPassword
    } else {
        delete userData.password;
    }
    if (req.files.avatar) {
        const imagePath = image.getFilePath(req.files.avatar)
        userData.avatar = imagePath
    }
    /*
    const containerName = "usuarios";
    const blobService = BlobServiceClient.fromConnectionString(Almacenamiento);
    const containerClient = blobService.getContainerClient(containerName);
    const blobName = `avatar_${req.files.avatar}`;
    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.uploadStream(req.files.avatar.path, undefined, undefined, { blobHTTPHeaders: { blobContentType: req.files.avatar } });
    */
    try {
        await User.findByIdAndUpdate({ _id: id }, userData);
        res.status(200).send({ msg: "Actualizacion correcta" });
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar el usuario" });
    }
}

async function updateActive(req, res) {
    const { id } = req.params;
    const userData = req.body;
    if (userData.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(userData.password, salt);
        userData.password = hashPassword
    } else {
        delete userData.password;
    }
    if (req.files.avatar) {
        const imagePath = image.getFilePath(req.files.avatar)
        userData.avatar = imagePath
    }
    console.log(userData.email);
    try {
        sendgrid.setApiKey(Apisendgrind);
        const activacion = {
            to: userData.email,
            from: {
                name: 'Kaapa Notifica',
                email: Email
            },
            templateId: Autorizacion
        }

        const sendMail = async () => {
            try {
                await sendgrid.send(activacion);
                console.log('Correo de activación enviado');
            } catch (error) {
                console.error(error);
                if (error.response) {
                    console.error(error.response.body)
                }
            }
        }
        sendMail();
        await User.findByIdAndUpdate({ _id: id }, userData);
        console.log(userData);
        res.status(200).send({ msg: "Actualizacion correcta" });
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar el usuario" });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        if (deleteUser) {
            res.status(200).send({ msg: "Usuario eliminado" });
        } else {
            res.status(400).send({ msg: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Error al eliminar usuario" });
    }
}



module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getAdmins,
    updateActive
}