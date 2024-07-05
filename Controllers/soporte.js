const { ConexionContenedor, Apisendgrind, Email, } = require("../constants");
const Soporte = require("../models/soporte");
const documento = require("../utils/documents")
const { BlobServiceClient } = require('@azure/storage-blob');
const sendgrid = require('@sendgrid/mail')

const blobService = BlobServiceClient.fromConnectionString(ConexionContenedor);

async function createSoporte(req, res) {
    try {
        const soporte = new Soporte(req.body);
        const documentosPath = documento.getFilePath(req.files.documentos);
        soporte.documentos = documentosPath;
        soporte.created_at = new Date();
        const soporteStored = await soporte.save();
        res.status(200).send({ msg: "Ticket creado", soporteStored });
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el ticket" });
    }
}
//Azure Contenedor
async function createSoporteconAzure(req, res) {
    const soporte = new Soporte({ ...req.body, asignado: 'Sin Asignar', estado: 'Pendiente' });
    if (req.file) {
        const { originalname, buffer } = req.file;
        const containerClient = blobService.getContainerClient("ticketsoporte");
        try {
            await containerClient.getBlockBlobClient(originalname).uploadData(buffer);
            const documentosPath = `ticketsoporte/${originalname}`;
            soporte.documentos = documentosPath;
        } catch (error) {
            return res.status(400).send({ msg: "Error al subir el archivo" });
        }
    } else {
        soporte.documentos = '';
    }
    try {
        const soporteStored = await soporte.save();
        res.status(201).send({ msg: "Ticket Creado: ", soporteStored });
        console.log(soporteStored);
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el ticket" });
        console.error(error)
    }
}

async function getSoporte(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const options = {
        page,
        limit: parseInt(limit),
    };
    Soporte.paginate({}, options, (error, soportes) => {
        if (error) {
            res.status(400).send({ msg: "Error al obtener la información ", error });
        } else {
            res.status(200).send(soportes);
        }
    })
}

//Get soporte Azure
async function getSoprteconAzure(req, res) {
    let soportes;

    try {
        soportes = await Soporte.find();
        const containerClient = blobService.getContainerClient("ticketsoporte");
        users = await Promise.all(soportes.map(async soporte => {
            if (soporte.documentos) {
                const blobClient = containerClient.getBlobClient(soporte.documentos.split('/').pop());
                const url = blobClient.url;
                soporte = soporte.toObject();
                soporte.documentosUrl = url;
            }
            return soporte;
        }));

        res.status(200).send(soportes);
    } catch (error) {
        res.status(500).send({ msg: "Error al obtener Tickets Soporte", error });
        console.log(error);
    }
}

//Solo consulte los ticket del usuario
async function getUsuarioSoporte(req, res) {
    try {
        const { page = 1, limit = 10, dueno } = req.query;
        let query = {};
        const options = {
            page,
            limit: parseInt(limit)
        };
        if (dueno) {
            query.dueno = dueno;
        }
        Soporte.paginate(query, options, (error, soportes) => {
            if (error) {
                res.status(400).send({ msg: "Error al obtener la información", error })
            } else {
                res.status(200).send(soportes)
            }
        });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send({ msg: "Error en el servidor" })
    }
}
//UPDATE GENERAL
async function updateSoporte(req, res) {
    try {
        const { id } = req.params;
        const soporteData = req.body;
        if (req.files.documentos) {
            const documentosPath = documento.getFilePath(req.files.documentos);
            soporteData.documentos = documentosPath;
        }
        const updateSoporte = await Soporte.findByIdAndUpdate({ _id: id }, soporteData, { new: true });
        if (!updateSoporte) {
            res.status(404).send({ msg: "Ticket no encontrado" });
        } else {
            res.status(200).send({ msg: "Actualización existosa", updateSoporte });
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar", error });
    }
}

//UPDATE ASIGNADO


async function deleteTicket(req, res) {
    const { id } = req.params;
    try {
        const deleteTicket = await Soporte.findByIdAndDelete(id);
        if (deleteTicket) {
            res.status(200).send({ msg: "Ticket eliminado" });
        } else {
            res.status(400).send({ msg: "Ticket no encontrado" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Error al eliminar el ticket" })
    }
}

async function cancelTicket(req, res) {
    try {
        const { id } = req.params
        const soporteData = req.body;
        soporteData.estado = 'Cancelado';
        soporteData.CancelDate = new Date();

        const cancelarticekt = await Soporte.findByIdAndUpdate({ _id: id }, soporteData, { new: true })
        if (!cancelarticekt) {
            res.status(404).send({ msg: "Ticket No Encontrado" });
        } else {
            res.status(200).send({ msg: "Ticket Cancelado" });
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualziar la información ", error })
        console.log(error);
    }
}



module.exports = {
    createSoporte,
    getSoporte,
    updateSoporte,
    deleteTicket,
    createSoporteconAzure,
    getSoprteconAzure,
    getUsuarioSoporte,
    cancelTicket
}