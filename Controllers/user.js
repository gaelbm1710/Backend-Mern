const { response } = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const image = require("../utils/image");
const sendgrid = require('@sendgrid/mail');
const { Apisendgrind, Email, Autorizacion, ConexionContenedor } = require("../constants")
const { BlobServiceClient } = require('@azure/storage-blob')


const blobService = BlobServiceClient.fromConnectionString(ConexionContenedor)

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
    let users;

    try {
        if (active === undefined) {
            users = await User.find();
        } else {
            users = await User.find({ active });
        }
        const containerClient = blobService.getContainerClient("avatar");

        users = await Promise.all(users.map(async user => {
            if (user.avatar) {
                const blobClient = containerClient.getBlobClient(user.avatar.split('/').pop());
                const url = blobClient.url;
                user = user.toObject();
                user.avatarUrl = url;
            }
            return user;
        }));

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ msg: "Error al obtener usuarios", error });
        console.log(error);
    }
}

async function getAdmins(req, res) {
    const { role } = req.query;
    let query = { role };
    try {
        const response = await User.find(query);
        //console.log(response);
        res.status(200).send(response);
    } catch (error) {
        console.error("Error al obtener usuarios", error);
        res.status(500).send({ msg: "Errror al obtener usuarios" })
    }
}

//Get Sistemas: 
async function getSistemas(req, res) {
    const role = "sistemas";
    let query = { role };
    try {
        const response = await User.find(query);
        res.status(200).send(response);
    } catch (error) {
        console.error("Error al obtener usuarios", error);
        res.status(500).send({ msg: "Errror al obtener usuarios" })
    }
}


async function createUser(req, res) {
    const { password } = req.body;
    const user = new User({ ...req.body, active: false });
    console.log(user.password);
    const salt = bcrypt.genSaltSync(10);
    const hasPassword = bcrypt.hashSync(password, salt);
    user.password = hasPassword;
    if (req.file) {
        const { originalname, buffer } = req.file;
        const containerClient = blobService.getContainerClient("avatar");
        try {
            await containerClient.getBlockBlobClient(originalname).uploadData(buffer);
            const imagePath = `avatar/${originalname}`;
            user.avatar = imagePath;
        } catch (error) {
            return res.status(400).send({ msg: "Error al subir la imagen" });

        }
    } else {
        user.avatar = 'avatar/default.jpg';
    }

    try {
        const userStored = await user.save();
        res.status(201).send({ msg: "Usuario creado", userStored });
        console.log(userStored);
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el usuario" });
        console.error(error);

    }
}



async function updateUser(req, res) {
    const { id } = req.params;
    const userData = req.body;

    if (userData.password) {
        console.log(userData.password);
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(userData.password, salt);
        userData.password = hashPassword;
    } else if (!userData.password) {
        console.log(userData.password);
        delete userData.password;
    }

    if (req.file) {
        const { originalname, buffer } = req.file;
        const containerClient = blobService.getContainerClient("avatar");
        try {
            await containerClient.getBlockBlobClient(originalname).uploadData(buffer);
            const imagePath = `avatar/${originalname}`;
            userData.avatar = imagePath;
        } catch (error) {
            return res.status(400).send({ msg: "Error al subir la imagen" });
        }
    }
    if (Array.isArray(userData.avatar)) {
        userData.avatar = userData.avatar[0];
    }

    try {
        await User.findByIdAndUpdate(id, userData);
        res.status(200).send({ msg: "Actualización correcta" });
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar el usuario" });
        console.log(error);
    }
}

async function updateActive(req, res) {
    const { id } = req.params;
    const userData = req.body;

    if (userData.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(userData.password, salt);
        userData.password = hashPassword;
    } else {
        delete userData.password;
    }

    if (req.file) {
        const { originalname, buffer } = req.file;
        const containerClient = blobService.getContainerClient("usuarios");

        try {
            await containerClient.getBlockBlobClient(originalname).uploadData(buffer);
            const imagePath = `usuarios/${originalname}`;
            userData.avatar = imagePath;
        } catch (error) {
            return res.status(400).send({ msg: "Error al subir la imagen" });
        }
    }

    try {
        sendgrid.setApiKey(Apisendgrind);
        const activacion = {
            to: userData.email,
            from: {
                name: 'Kaapa Notifica',
                email: Email
            },
            templateId: Autorizacion
        };

        await sendgrid.send(activacion);
        console.log('Correo de activación enviado');

        await User.findByIdAndUpdate(id, userData);
        res.status(200).send({ msg: "Actualización correcta" });
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar el usuario" });
        console.error(error);
        if (error.response) {
            console.error(error.response.body);
        }
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

async function uploadBlob(req, res) {
    try {
        const { container } = req.body;
        const { originalname, buffer } = req.file
        const containerCliente = blobService.getContainerClient(container)
        const blobupload = await containerCliente.getBlockBlobClient(originalname).uploadData(buffer);
        if (blobupload) {
            res.status(200).send({ msg: "Archivo Cargado" })
        } else {
            res.status(400).send({ msg: "Error al subir Archivo" })
        }
    } catch (error) {
        res.status(500).send({ msg: "Error en el Servidor" })
    }
}

async function getBlob(req, res) {
    try {
        const { container, filename } = req.params;
        const containerCliente = blobService.getContainerClient(container)
        const bloblget = await containerCliente.getBlockBlobClient(filename).downloadToBuffer();
        res.header("Content-Type", "image/jpg", "image/png")
        if (bloblget) {
            res.status(200).send(bloblget)
        } else {
            res.status(400).send({ msg: "Error al subir Archivo" })
        }
    } catch (error) {
        res.status(500).send({ msg: "Error en el Servidor" })
    }
}

async function DownloadBlob(req, res) {
    try {
        const { container, filename } = req.params;
        const containerCliente = blobService.getContainerClient(container)
        const bloblget = await containerCliente.getBlockBlobClient(filename).downloadToBuffer();
        if (bloblget) {
            res.status(200).send({ msg: "Archivo Cargado" })
        } else {
            res.status(400).send({ msg: "Error al subir Archivo" })
        }
    } catch (error) {
        res.status(500).send({ msg: "Error en el Servidor" })
    }
}



module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getAdmins,
    updateActive,
    uploadBlob,
    getBlob,
    DownloadBlob,
    getSistemas
}