const jwt = require('../utils/jwt');
const User = require("../models/user");

async function activo(req,res){
    if(!req.headers.authorization){
        res.status(403).send({msg:"La peticion no tiene Autenticación"});
    }
    const token = req.headers.authorization.replace("Bearer ","");

    try{
        const payload = jwt.decoded(token);
        const user = await User.findById(payload.id);
        if(!user){
            return res.status(400).send({msg: "Usuario no encontrado"});
        }
        if(!user.active){
            res.status(401).send({msg: "La cuenta no esta activa, favor de contactar a Soporte"});
        }
        req.user = user;
        next();
    }catch(error){
        res.status(400).send({msg:"Token Invalido"});
    }
}

module.exports={
    activo
}