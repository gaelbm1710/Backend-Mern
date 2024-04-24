const { query } = require("express");
const Mag = require("../models/magistrales");
const User = require("../models/user");
const sendgrid = require('@sendgrid/mail');
const { Apisendgrind, Email, CotizacionNueva,PFIYNDE, CotizacionFinalizada } = require("../constants")

async function createMag(req, res) {
    try {
        const iyndes = await User.find({ role: "iyd" });
        const iyndeEmails = iyndes.map(iynde => iynde.email);
        const mag = new Mag({
            ...req.body,
            sIyD: false, sOp: false, sCom: false, refri: false,
            receta: false, StatusGeneral: false
        })
        mag.created_at = new Date();
        //console.log("Esto es el primer mag:", mag);
        const magiStored = await mag.save();
       // console.log("Esto es mag", mag);
       // console.log("Esto es magiStored", magiStored);
        sendgrid.setApiKey(Apisendgrind);
        const NuevaCotizacion = {
            to: iyndeEmails,
            from: {
                name: 'Cotización Nueva',
                email: Email
            },
            templateId: CotizacionNueva,
            dynamic_template_data: {
                Folio: magiStored.folio,
                asesor: magiStored.asesor
            }
        }
        const sendMail = async () => {
            try {
                await sendgrid.send(NuevaCotizacion);
                console.log('Correo de Cotización Nueva');
            } catch (error) {
                console.error(error);
                if (error.response) {
                    console.error(error.response.body);
                }
            }
        }
        sendMail();
        res.status(200).send({ msg: "Cotizacion Creada: ", magiStored })
    } catch (error) {
        res.status(400).send({ msg: "Error al crear cotización", error });
        console.log(error);
    }
}

async function getMag(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const options = {
        page,
        limit: parseInt(limit),
    };
    Mag.paginate({}, options, (error, mags) => {
        if (error) {
            res.status(400).send({ msg: "Error al obtener la información", error })
        } else {
            res.status(200).send(mags);
        }
    });
}
//Cotización NUEVA
async function updateMagInyDe(req, res) {
    try {
        const opes = await User.find({ role: "ope" });
        const opeEmails = opes.map(ope => ope.email);
        const { id } = req.params;
        const magData = req.body;
        magData.sIyD = true;
        magData.StatusGeneral = false;
        sendgrid.setApiKey(Apisendgrind);
        const procesoInyde = {
            to: opeEmails,
            from: {
                name: 'Cotización Nueva',
                email: Email
            },
            templateId: PFIYNDE,
            dynamic_template_data: {
                Folio: magiStored.folio
            }
        }
        const sendMail = async () =>{
            try {
                console.log("Correo Enviado de Proceso F. INYDE");
                await sendgrid.send(procesoInyde);
            } catch (error) {
                console.error(error);
                if(error.response){
                    console.error(error.response.body);
                }
            }
        }
        sendMail();
        const updateMag = await Mag.findByIdAndUpdate({ _id: id }, magData, { new: true });
        if (!updateMag) {
            res.status(404).send({ msg: "Cotización no encontrada" })
        } else {
            res.status(200).send({ msg: "Actualziación Exitosa" });
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar la información" });
        console.log(error);
    }
}

async function updateMagOpe(req, res) {
    try {
        const comes = await User.find({role: "com"});
        const comeEmails = comes.map(come => come.email);
        const { id } = req.params;
        const magData = req.body;
        magData.sOp = true;
        magData.StatusGeneral = false;
        console.log(magData.asesor);
        sendgrid.setApiKey(Apisendgrind);
        const procesoOpe={
            to: [comeEmails, magData.asesor],
            from:{
                name:'Cotización Nueva',
                email: Email
            },
            templateId: PFIYNDE,
            dynamic_template_data: {
                Folio: magData.folio,
                CardCode: magData.activos,
                Base: magData.base,
                Refrigeracion: magData.refri,
                Caducidad: magData.caducidad,
                Receta: magData.receta,
                Exclusiva: magData.excl,
                Clasificacion: magData.clasi,
                Comentarios: magData.comCli,
                precio1: magData.precio1,
                precio2: magData.precio2,
                precio3: magData.precio3,
                precio4: magData.precio4,
                precio5: magData.precio5,
                precio6: magData.precio6,
                precio7: magData.precio7,
                precio8: magData.precio8
            }
        }
        const sendMail = async () =>{
            try {
                console.log("Correo Enviado Proceso F Ope");
                await sendgrid.send(procesoOpe);
            } catch (error) {
                console.error(error);
                if(error.response){
                    console.error(error.response.body);
                }
            }
        }
        sendMail();
        const updateMag = await Mag.findByIdAndUpdate({ _id: id }, magData, { new: true });
        if (!updateMag) {
            res.status(404).send({ msg: "Cotización no encontrada" })
        } else {
            res.status(200).send({ msg: "Actualziación Exitosa" });
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar la información" });
        console.log(error);
    }
}

async function updateMagCome(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
        magData.sCom = true;
        magData.StatusGeneral = true;
        sendgrid.setApiKey(Apisendgrind);
        const formulaNueva={
            to: magData.asesor,
            from: {
                name:'Cotización Nueva',
                email: Email
            },
            templateId: CotizacionFinalizada,
            dynamic_template_data: {
                Folio: magData.folio,
                Clave: magData.folio_sCom
            }
        }
        const sendMail = async () =>{
            try {
                console.log('Correo de Cotizacion nueva enviado');
                await sendgrid.send(formulaNueva);
            } catch (error) {
                console.error(error);
                if(error.response){
                    console.error(error.response.body);
                }
            }
        }
        sendMail();
        const updateMag = await Mag.findByIdAndUpdate({ _id: id }, magData, { new: true });
        if (!updateMag) {
            res.status(404).send({ msg: "Cotización no encontrada" })
        } else {
            res.status(200).send({ msg: "Actualziación Exitosa" });
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar la información" });
        console.log(error);
    }
}

//COTIZACION Nueva PRESENTACION
async function updateMagiInyDe(req, res) {
    try {
        const opes = await User.find({ role: "ope" });
        const opeEmails = opes.map(ope => ope.email);
        const { id } = req.params;
        const magData = req.body;
        magData.sIyD = true;
        magData.StatusGeneral = false;
        sendgrid.setApiKey(Apisendgrind);
        const procesoInyde = {
            to: opeEmails,
            from: {
                name: 'Presentación Nueva',
                email: Email
            },
            templateId: PFIYNDE,
            dynamic_template_data: {
                Folio: magiStored.folio
            }
        }
        const sendMail = async () =>{
            try {
                console.log("Correo Enviado de Proceso F. INYDE");
                await sendgrid.send(procesoInyde);
            } catch (error) {
                console.error(error);
                if(error.response){
                    console.error(error.response.body);
                }
            }
        }
        sendMail();
        const updateMag = await Mag.findByIdAndUpdate({ _id: id }, magData, { new: true });
        if (!updateMag) {
            res.status(404).send({ msg: "Cotización no encontrada" })
        } else {
            res.status(200).send({ msg: "Actualziación Exitosa" });
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar la información" });
        console.log(error);
    }
}

async function updateMagiOpe(req, res) {
    try {
        const comes = await User.find({role: "com"});
        const comeEmails = comes.map(come => come.email);
        const { id } = req.params;
        const magData = req.body;
        magData.sOp = true;
        magData.StatusGeneral = false;
        console.log(magData.asesor);
        sendgrid.setApiKey(Apisendgrind);
        const procesoOpe={
            to: [comeEmails, magData.asesor],
            from:{
                name:'Presentación Nueva',
                email: Email
            },
            templateId: PFIYNDE,
            dynamic_template_data: {
                Folio: magData.folio,
                CardCode: magData.activos,
                Base: magData.base,
                Refrigeracion: magData.refri,
                Caducidad: magData.caducidad,
                Receta: magData.receta,
                Exclusiva: magData.excl,
                Clasificacion: magData.clasi,
                Comentarios: magData.comCli,
                precio1: magData.precio1,
                precio2: magData.precio2,
                precio3: magData.precio3,
                precio4: magData.precio4,
                precio5: magData.precio5,
                precio6: magData.precio6,
                precio7: magData.precio7,
                precio8: magData.precio8
            }
        }
        const sendMail = async () =>{
            try {
                console.log("Correo Enviado Proceso F Ope");
                await sendgrid.send(procesoOpe);
            } catch (error) {
                console.error(error);
                if(error.response){
                    console.error(error.response.body);
                }
            }
        }
        sendMail();
        const updateMag = await Mag.findByIdAndUpdate({ _id: id }, magData, { new: true });
        if (!updateMag) {
            res.status(404).send({ msg: "Cotización no encontrada" })
        } else {
            res.status(200).send({ msg: "Actualziación Exitosa" });
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar la información" });
        console.log(error);
    }
}

async function updateMagiCome(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
        magData.sCom = true;
        magData.StatusGeneral = true;
        sendgrid.setApiKey(Apisendgrind);
        const formulaNueva={
            to: magData.asesor,
            from: {
                name:'Presentación Nueva',
                email: Email
            },
            templateId: CotizacionFinalizada,
            dynamic_template_data: {

            }
        }
        const sendMail = async () =>{
            try {
                console.log('Correo de Cotizacion nueva enviado');
                await sendgrid.send(formulaNueva);
            } catch (error) {
                console.error(error);
                if(error.response){
                    console.error(error.response.body);
                }
            }
        }
        sendMail();
        const updateMag = await Mag.findByIdAndUpdate({ _id: id }, magData, { new: true });
        if (!updateMag) {
            res.status(404).send({ msg: "Cotización no encontrada" })
        } else {
            res.status(200).send({ msg: "Actualziación Exitosa" });
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar la información" });
        console.log(error);
    }
}

//Cotizar Cambio de Base:
async function updateMagisInyDe(req, res) {
    try {
        const opes = await User.find({ role: "ope" });
        const opeEmails = opes.map(ope => ope.email);
        const { id } = req.params;
        const magData = req.body;
        magData.sIyD = true;
        magData.StatusGeneral = false;
        sendgrid.setApiKey(Apisendgrind);
        const procesoInyde = {
            to: opeEmails,
            from: {
                name: 'Presentación Nueva',
                email: Email
            },
            templateId: PFIYNDE,
            dynamic_template_data: {
                Folio: magiStored.folio
            }
        }
        const sendMail = async () =>{
            try {
                console.log("Correo Enviado de Proceso F. INYDE");
                await sendgrid.send(procesoInyde);
            } catch (error) {
                console.error(error);
                if(error.response){
                    console.error(error.response.body);
                }
            }
        }
        sendMail();
        const updateMag = await Mag.findByIdAndUpdate({ _id: id }, magData, { new: true });
        if (!updateMag) {
            res.status(404).send({ msg: "Cotización no encontrada" })
        } else {
            res.status(200).send({ msg: "Actualziación Exitosa" });
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar la información" });
        console.log(error);
    }
}

async function updateMagisOpe(req, res) {
    try {
        const comes = await User.find({role: "com"});
        const comeEmails = comes.map(come => come.email);
        const { id } = req.params;
        const magData = req.body;
        magData.sOp = true;
        magData.StatusGeneral = false;
        console.log(magData.asesor);
        sendgrid.setApiKey(Apisendgrind);
        const procesoOpe={
            to: [comeEmails, magData.asesor],
            from:{
                name:'Presentación Nueva',
                email: Email
            },
            templateId: PFIYNDE,
            dynamic_template_data: {
                Folio: magData.folio,
                CardCode: magData.activos,
                Base: magData.base,
                Refrigeracion: magData.refri,
                Caducidad: magData.caducidad,
                Receta: magData.receta,
                Exclusiva: magData.excl,
                Clasificacion: magData.clasi,
                Comentarios: magData.comCli,
                precio1: magData.precio1,
                precio2: magData.precio2,
                precio3: magData.precio3,
                precio4: magData.precio4,
                precio5: magData.precio5,
                precio6: magData.precio6,
                precio7: magData.precio7,
                precio8: magData.precio8
            }
        }
        const sendMail = async () =>{
            try {
                console.log("Correo Enviado Proceso F Ope");
                await sendgrid.send(procesoOpe);
            } catch (error) {
                console.error(error);
                if(error.response){
                    console.error(error.response.body);
                }
            }
        }
        sendMail();
        const updateMag = await Mag.findByIdAndUpdate({ _id: id }, magData, { new: true });
        if (!updateMag) {
            res.status(404).send({ msg: "Cotización no encontrada" })
        } else {
            res.status(200).send({ msg: "Actualziación Exitosa" });
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar la información" });
        console.log(error);
    }
}

async function updateMagisCome(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
        magData.sCom = true;
        magData.StatusGeneral = true;
        sendgrid.setApiKey(Apisendgrind);
        const formulaNueva={
            to: magData.asesor,
            from: {
                name:'Presentación Nueva',
                email: Email
            },
            templateId: CotizacionFinalizada,
            dynamic_template_data: {

            }
        }
        const sendMail = async () =>{
            try {
                console.log('Correo de Cotizacion nueva enviado');
                await sendgrid.send(formulaNueva);
            } catch (error) {
                console.error(error);
                if(error.response){
                    console.error(error.response.body);
                }
            }
        }
        sendMail();
        const updateMag = await Mag.findByIdAndUpdate({ _id: id }, magData, { new: true });
        if (!updateMag) {
            res.status(404).send({ msg: "Cotización no encontrada" })
        } else {
            res.status(200).send({ msg: "Actualziación Exitosa" });
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar la información" });
        console.log(error);
    }
}

async function deleteMag(req, res) {
    const { id } = req.params;
    try {
        const deleteMag = await Mag.findByIdAndDelete(id)
        if (deleteMag) {
            res.status(200).send({ msg: "Cotización eliminada" });
        } else {
            res.status(400).send({ msg: "Cotización no encontrada" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Error al eliminar el Post" })
    }
}

async function getMagbyCardcode(req, res) {
    try {
        const { cardcode } = req.params;
        const cotiStored = await Mag.find({ cardcode });
        if (!cotiStored) {
            return res.status(404).send({ msg: "Cotización no encontradas" })
        }
        res.status(200).send(cotiStored)
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send({ msg: "Error en el servidor" })
    }
}
/*
async function createMagi(req, res) {
    try {
        const mag = new Mag(req.body);
        const magiStored = await mag.save();
        mag.created_at = new Date();
        res.status(200).send({ msg: "Cotizacion Creada: ", magiStored })
    } catch (error) {
        res.status(400).send({ msg: "Error al crear cotización" });
    }
}
*/
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

async function getMagbyActvidad(req, res) {
    console.log(req.params);
    try {
        const { actividad } = req.params;
        const cotiStored = await Mag.find({ actividad });
        console.log(cotiStored);
        if (!cotiStored) {
            return res.status(404).send({ msg: "Cotización no encontradas" })
        }
        res.status(200).send(cotiStored)
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send({ msg: "Error en el servidor" })
    }
}

async function getMagbyActvidadyAsesor(req, res) {
    try {
        const { page = 1, limit = 10, actividad, asesor } = req.query;
        let query = {};
        const options = {
            page,
            limit: parseInt(limit),
        };
        if (actividad) {
            query.actividad = actividad;
        }
        if (asesor) {
            query.asesor = asesor;
        }
        Mag.paginate(query, options, (error, mags) => {
            if (error) {
                res.status(400).send({ msg: "Error al obtener la información", error })
            } else {
                res.status(200).send(mags);
            }
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send({ msg: "Error en el servidor" })
    }
}



module.exports = {
    createMag,
    getMag,
    updateMagInyDe,
    updateMagOpe,
    updateMagCome,
    deleteMag,
    getMagbyCardcode,
    getMagbyAsesor,
    getMagbyActvidad,
    getMagbyActvidadyAsesor,
    updateMagiCome,
    updateMagiInyDe,
    updateMagiOpe,
    updateMagisOpe,
    updateMagisInyDe,
    updateMagisCome,
}