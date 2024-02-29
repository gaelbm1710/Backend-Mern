const Mag = require("../models/magistrales");

async function createMag(req, res){
    try {
        const mag = new Mag(req.body);
        mag.created_at = new Date();
        const magStored = await mag.save();
        res.status(200).send(magStored);
    } catch (error) {
        res.status(400).send({msg:"Error al crear la cotización", error})
    }
}

async function getMag(req,res){
    const {page = 1, limit = 10} = req.query;
    const options = {
        page,
        limit: parseInt(limit),
    };
    Mag.paginate({}, options, (error, mags)=>{
        if(error){
            res.status(400).send({msg: "Error al obtener la información", error})
        }else{
            res.status(200).send(mags);
        }
    });
}

async function updateMag(req,res){
    try {
        const {id} = req.params;
        const magData = req.body;
        const updateMag = await Mag.findByIdAndUpdate({ _id: id}, magData, {new: true});
        if(!updateMag){
            res.status(404).send({msg: "Cotización no encontrada"})
        }else{
            res.status(200).send({msg: "Actualziación Exitosa"});
        }
    } catch (error) {
        res.status(400).send({msg:"Error al actualizar la información"});
        console.log(error);
    }
}

async function deleteMag(req,res){
    const {id} = req.params;
    try {
        const deleteMag = await Mag.findByIdAndDelete(id)
        if(deleteMag){
            res.status(200).send({msg: "Cotización eliminada"});
        }else{
            res.status(400).send({msg: "Cotización no encontrada"});
        }
    } catch (error) {
        res.status(500).send({msg: "Error al eliminar el Post"})
    }
}

async function getMagi(req,res){
    try {
        const {cardcode} = req.params;
        const magStored = await Mag.find({cardcode});
        if(!magStored){
            return res.status(404).send({msg: "Cotización no encontrada"});
        }
        res.status(200).send(magStored);
    } catch (error) {
        console.error("Error: ",error);
        res.status(500).send({msg: "Error en el servidor"})
        
    }
}

module.exports={
    createMag,
    getMag,
    updateMag,
    deleteMag,
    getMagi,
}