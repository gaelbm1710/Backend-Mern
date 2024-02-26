const jwt = require("../utils/jwt");

function asureAuth(req,res,next){
    if(!req.headers.authorization){
        res.status(403).send({msg:"La peticion no tiene Autenticación"});
    }
    const token = req.headers.authorization.replace("Bearer ","");

    try{
        const payload = jwt.decoded(token);
        const {exp} = payload;
        const currentData = new Date().getDate();
        if(exp <= currentData){
            return res.send(400).send({msg:"El Token ha expirado"});
        }
        req.user=payload;
        next();
    }catch(error){
        res.status(400).send({msg:"Token Invalido"});
    }
}

module.exports={
    asureAuth,
}