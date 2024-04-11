const Soporte = require("../models/soporte");
const documento = require("../utils/documents")

async function createSoporte(req, res){
    try {
        const soporte = new Soporte(req.body);
        const documentosPath = documento.getFilePath(req.files.documentos);
        soporte.documentos = documentosPath;
        soporte.created_at = new Date();
        const soporteStored = await soporte.save();
        res.status(200).send({ msg: "Ticket creado",soporteStored});
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el ticket"});
    }
}

async function getSoporte(req, res){
    const {page = 1, limit = 10 } = req.query;
    const options = {
        page,
        limit: parseInt(limit),
    };
    Soporte.paginate({}, options, (error, soportes)=>{
        if(error){
            res.status(400).send({msg:"Error al obtener la información ", error});
        }else{
            res.status(200).send(soportes);
        }
    })
}

async function updateSoporte(req, res){
    try {
        const {id} = req.params;
        const soporteData = req.body;
        if(req.files.documentos){
            const documentosPath = documento.getFilePath(req.files.documentos);
            soporteData.documentos = documentosPath;
        }
        const updateSoporte = await Soporte.findByIdAndUpdate({_id:id}, soporteData, {new: true});
        if(!updateSoporte){
            res.status(404).send({msg: "Ticket no encontrado"});
        }else{
            res.status(200).send({msg: "Actualización existosa", updateSoporte});
        }
    } catch (error) {
        res.status(400).send({msg: "Error al actualizar", error});
    }
}

async function deleteTicket(req,res){
    const {id} = req.params;
    try {
        const deleteTicket = await Soporte.findByIdAndDelete(id);
        if(deleteTicket){
            res.status(200).send({msg:"Ticket eliminado"});
        }else{
            res.status(400).send({msg: "Ticket no encontrado"});
        }
    } catch (error) {
        res.status(500).send({msg:"Error al eliminar el ticket"})
    }
}

module.exports={
    createSoporte,
    getSoporte,
    updateSoporte,
    deleteTicket
}