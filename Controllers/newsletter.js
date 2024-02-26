const Newsletter = require("../models/newsletter");

async function suscribeEmail(req, res) {
    try {
        const { email } = req.body;
        const lowercasedEmail = email.toLowerCase();
        const existingNewsletter = await Newsletter.findOne({ email: lowercasedEmail });
        if (existingNewsletter) {
            res.status(400).send({ msg: "El email ya está registrado" });
            return;
        }
        const newsletter = new Newsletter({ email: lowercasedEmail });
        await newsletter.save();
        res.status(200).send({ msg: "El email se ha registrado con éxito" });
    } catch (error) {
        res.status(500).send({ msg: "Error del servidor", error });
    }
}

async function getEmail(req, res) {
    const {page = 1, limit = 10} = req.query;
    const options = {
        page,
        limit: parseInt(limit),
    };
    Newsletter.paginate({}, options, (error, newsletters)=> {
        if(error) {
            res.status(400).send({ msg: "Error al obtener la información", error });
        } else {
            res.status(200).send(newsletters);
        }
    });
}


    async function deleteEmail(req,res){
        const { id } = req.params;
        try{
            const deleteEmail = await Newsletter.findByIdAndDelete(id);
            if(deleteEmail){
                res.status(200).send({msg: "Email eliminado"});
            }else{
                res.status(400).send({msg: "Email no encontrado"});
            }
        }catch (error){
            res.status(500).send({msg:"Error al eliminar el Email"});
        }
}


module.exports={
    suscribeEmail,
    getEmail,
    deleteEmail
}