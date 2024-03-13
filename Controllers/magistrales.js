const Mag = require("../models/magistrales");

async function createMag(req, res){
    try {
        console.log(req.body);
        const mag = new Mag(req.body);
        mag.created_at=new Date();
        console.log("Esto es el primer mag:",mag);
        const magiStored = await mag.save();
        console.log("Esto es mag",mag);
        res.status(200).send({msg:"Cotizacion Creada: ",magiStored})
        console.log("Esto es magiStored",magiStored);
    } catch (error) {
        res.status(400).send({msg: "Error al crear cotización"});
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

async function getMagbyCardcode(req,res){
    try {
        const {cardcode} = req.params;
        const cotiStored = await Mag.find({cardcode});
        if(!cotiStored){
            return res.status(404).send({msg: "Cotización no encontradas"})
        }
        res.status(200).send(cotiStored)
    } catch (error) {
        console.log("Error: ",error);
        res.status(500).send({msg:"Error en el servidor"})
    }
}

async function createMagi(req, res){
    try {
        const mag = new Mag(req.body);
        const magiStored = await mag.save();
        mag.created_at=new Date();
        res.status(200).send({msg:"Cotizacion Creada: ",magiStored})
    } catch (error) {
        res.status(400).send({msg: "Error al crear cotización"});
    }
}
async function getMagbyAsesor(req, res) {
    try {
        const { asesor } = req.params;
        const cotiStored = await Mag.find({ asesor }).populate('asesor');
        if (cotiStored.length === 0) {
            return res.status(404).send({ msg: "Cotizaciones no encontradas" });
        }
        res.status(200).send(cotiStored);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send({ msg: "Error en el servidor" });
    }
}




module.exports={
    createMag,
    getMag,
    updateMag,
    deleteMag,
    getMagbyCardcode,
    createMagi,
    getMagbyAsesor,
}