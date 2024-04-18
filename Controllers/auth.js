const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");
const sendgrid = require('@sendgrid/mail');
const { Email} = require('../constants')


function register(req,res){
const {firstname, lastname, email, password} = req.body;

if(!email) res.status(400).send({msg: "EL email es obligatorio"});
if(!password) res.status(400).send({msg: "La contraseña es Obligatoria"});

const user = new User({
    firstname,
    lastname,
    email: email.toLowerCase(),
    role: "user",
    active: false,

});

const salt = bcrypt.genSaltSync(10);
const hashPassword = bcrypt.hashSync(password, salt);
user.password = hashPassword;

const saveUser = async () =>{
    const admins = await User.find({role: "admin"});
    const adminsEmails = admins.map(admin => admin.email)
    try{
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: adminsEmails,
            from: {
                name: 'Kaapa Notifica',
                email: Email
            },
            subject: 'Registro de Usuario',
            text: 'Un ususario quiere accesar a Kaapa',
            html: '<strong>Un ususario quiere accesar a Kaapa</strong>',
        }
        const sendMail = async () =>{
            try {
                await sendgrid.send(msg);
                console.log('Correo enviado de registro');
            } catch (error) {
                console.error(error);
                if(error.response){
                    console.error(error.response.body)
                }
            }
        }
        sendMail();
        await user.save();
        res.status(200).send({msg:"Usuario Creado con Exito"});
        
    }
    catch(error){
        res.status(400).send({msg: "Error al crear usuario"});
        console.error("Error del servidor", error);
        if(!res.headersSent){
            res.status(500).send({msg:"Error al crear usuario"})
        }
    }
}
saveUser();

}

async function login (req,res){
    const {email, password }  = req.body;
    if(!email) res.status(400).send({msg:"El email es obligatorio"});
    if(!password) res.status(400).send({msg:"El password es obligatorio"});
    const emailLowerCase = email.toLowerCase();
    try {
        const response = await User.findOne({ email: emailLowerCase })
        bcrypt.compare(password, response.password, (bcryptError, check) => {
            if(bcryptError){
                res.status(500).send({msg:"Error del servidor"});
            }else if (!check){
                res.status(400).send({msg:"Contraseña incorrecta"});
            }else if(!response.active){
                res.status(400).send({msg:"Usuario no autorizado o no activo"});
            }else{
                res.status(200).send({
                    access : jwt.createAccessToken(response),
                    refres :jwt.createRefreshToken(response)
                });
            }
        })
    } catch (error) {
        res.status(500).send({msg:"Error del servidor"});
    }
}

async function refreshAccesToken(req, res) {
    const { token } = req.body;
    if (!token) res.status(400).send({ msg: "token requerido" });
    const { user_id }=jwt.decoded(token);
    try {
      const response = await User.findOne({ _id: user_id });
      console.log(response);
      res.status(200).send({
        accessToken: jwt.createAccessToken(response),
      });
    } catch (error) {
      res.status(500).send({ msg: "Error en el Servidor " });
      console.log(error);
    }
  }

module.exports = {
    register,
    login,
    refreshAccesToken
};