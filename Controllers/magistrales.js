const { query } = require("express");
const sql = require('mssql');
const { SQL_DATABASE, SQL_PASSWORD, SQL_PORT, SQL_SERVER, SQL_USER } = require("../constants");
const Mag = require("../models/magistrales");
const User = require("../models/user");
const sendgrid = require('@sendgrid/mail');
const { Apisendgrind, Email, CotizacionNueva, InydeCotizacionNueva, OpeCotizacionNueva, CotizacionFinalizada, InydePresentacionNueva, PresentacionFinalizada, cambioNuevo, CancelMag, InydeCambioNuevo, OpeCambioNueva, CambioFinalizado, PresentacionNueva } = require("../constants")


async function createMag(req, res) {
    try {
        const iyndes = await User.find({ role: "iyd" });
        const iyndeEmails = iyndes.map(iynde => iynde.email);
        const mag = new Mag({
            ...req.body,
            sIyD: false, sOp: false, sCom: false, refri: false,
            receta: false, StatusGeneral: "Pendiente"
        })
        mag.created_at = new Date();
        const magiStored = await mag.save();
        sendgrid.setApiKey(Apisendgrind);
        let template;
        switch (magiStored.actividad) {
            case 'nueva':
                template = CotizacionNueva;
                break;
            case 'presentacion':
                template = PresentacionNueva
                break;
            case 'cambio':
                template = cambioNuevo
                break;
            default:
                template = CotizacionNueva
        }
        const NuevaCotizacion = {
            to: iyndeEmails,
            from: {
                name: 'Cotización Nueva',
                email: Email
            },
            templateId: template,
            dynamic_template_data: {
                Folio: magiStored.folio,
                asesor: magiStored.asesor,
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
        magData.finishDateiyde = new Date();
        sendgrid.setApiKey(Apisendgrind);
        console.log(magData.folio);
        const procesoInyde = {
            to: opeEmails,
            from: {
                name: 'Cotización Nueva',
                email: Email
            },
            templateId: InydeCotizacionNueva,
            dynamic_template_data: {
                Folio: magData.folio
            }
        }
        const sendMail = async () => {
            try {
                console.log("Correo Enviado de Proceso F. INYDE");
                await sendgrid.send(procesoInyde);
            } catch (error) {
                console.error(error);
                if (error.response) {
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

async function saveMagIyD(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
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
        const comes = await User.find({ role: "com" });
        const comeEmails = comes.map(come => come.email);
        const { id } = req.params;
        const magData = req.body;
        magData.sOp = true;
        magData.finishDateope = new Date();
        sendgrid.setApiKey(Apisendgrind);
        const procesoOpe = {
            to: [...comeEmails, magData.asesor],
            from: {
                name: 'Cotización Nueva',
                email: Email
            },
            templateId: OpeCotizacionNueva,
            dynamic_template_data: {
                Folio: magData.folio,
                CardCode: magData.cardcode,
                Activos: magData.activos,
                Base: magData.base,
                Refrigeracion: magData.refri ? 'Si' : 'No',
                Caducidad: magData.caducidad,
                Receta: magData.receta ? 'Si' : 'No',
                Exclusiva: magData.excl ? 'Si' : 'No',
                Clasificacion: magData.clasi,
                Comentarios: magData.comClie,
                precio1: magData.precio1,
                precio2: magData.precio2,
                precio3: magData.precio3,
                precio4: magData.precio4,
                precio5: magData.precio5,
                precio6: magData.precio6,
                precio7: magData.precio7,
                precio8: magData.precio8,
                Envases: magData.envases
            }
        }
        const sendMail = async () => {
            try {
                console.log("Correo Enviado Proceso F Ope");
                await sendgrid.send(procesoOpe);
            } catch (error) {
                console.error(error);
                if (error.response) {
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

async function saveMagOpe(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
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
        magData.StatusGeneral = "Finalizado";
        magData.finishDategc = new Date();
        sendgrid.setApiKey(Apisendgrind);
        console.log(magData.asesor);
        const formulaNueva = {
            to: magData.asesor,
            from: {
                name: 'Cotización Nueva',
                email: Email
            },
            templateId: CotizacionFinalizada,
            dynamic_template_data: {
                Folio: magData.folio,
                Clave: magData.folio_sCom
            }
        }
        const sendMail = async () => {
            try {
                console.log('Correo de Cotizacion nueva enviado');
                await sendgrid.send(formulaNueva);
            } catch (error) {
                console.error(error);
                if (error.response) {
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

async function saveMagCome(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
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
        const comes = await User.find({ role: "com" });
        const comeEmails = comes.map(come => come.email);
        const { id } = req.params;
        const magData = req.body;
        magData.sIyD = true;
        magData.finishDateiyde = new Date();
        sendgrid.setApiKey(Apisendgrind);
        const procesoInyde = {
            to: [...comeEmails, magData.asesor],
            from: {
                name: 'Presentación Nueva',
                email: Email
            },
            templateId: InydePresentacionNueva,
            dynamic_template_data: {
                Folio: magData.folio,
                CardCode: magData.cardcode,
                Comentarios: magData.comClie,
                Clave_EX: magData.clave_ex,
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
        const sendMail = async () => {
            try {
                console.log("Correo Enviado de Proceso F. INYDE");
                await sendgrid.send(procesoInyde);
            } catch (error) {
                console.error(error);
                if (error.response) {
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

async function saveMagiInyDe(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
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
        const comes = await User.find({ role: "com" });
        const comeEmails = comes.map(come => come.email);
        const { id } = req.params;
        const magData = req.body;
        magData.sOp = true;
        magData.finishDateope = new Date();
        console.log(magData.asesor);
        sendgrid.setApiKey(Apisendgrind);
        const procesoOpe = {
            to: [
                { email: comeEmails },
                { email: magData.asesor }
            ],
            from: {
                name: 'Presentación Nueva',
                email: Email
            },
            templateId: OpeCotizacionNueva,
            dynamic_template_data: {
                Folio: magData.folio
            }
        }
        const sendMail = async () => {
            try {
                console.log("Correo Enviado Proceso F Ope");
                await sendgrid.send(procesoOpe);
            } catch (error) {
                console.error(error);
                if (error.response) {
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

async function saveMagiOpe(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
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
        magData.StatusGeneral = "Finalizado";
        magData.finishDategc = new Date();
        sendgrid.setApiKey(Apisendgrind);
        const formulaNueva = {
            to: magData.asesor,
            from: {
                name: 'Presentación Nueva',
                email: Email
            },
            templateId: PresentacionFinalizada,
            dynamic_template_data: {
                Folio: magData.folio,
                Clave: magData.folio_sCom
            }
        }
        const sendMail = async () => {
            try {
                console.log('Correo de Cotizacion nueva enviado');
                await sendgrid.send(formulaNueva);
            } catch (error) {
                console.error(error);
                if (error.response) {
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

async function saveMagiCome(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
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
        magData.finishDateiyde = new Date();
        sendgrid.setApiKey(Apisendgrind);
        const procesoInyde = {
            to: opeEmails,
            from: {
                name: 'Presentación Nueva',
                email: Email
            },
            templateId: InydeCambioNuevo,
            dynamic_template_data: {
                Folio: magData.folio
            }
        }
        const sendMail = async () => {
            try {
                console.log("Correo Enviado de Proceso F. INYDE");
                await sendgrid.send(procesoInyde);
            } catch (error) {
                console.error(error);
                if (error.response) {
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

async function saveMagisInyDe(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
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
        const comes = await User.find({ role: "com" });
        const comeEmails = comes.map(come => come.email);
        const { id } = req.params;
        const magData = req.body;
        magData.sOp = true;
        magData.finishDateope = new Date();
        console.log(magData.asesor);
        sendgrid.setApiKey(Apisendgrind);
        const procesoOpe = {
            to: [...comeEmails, magData.asesor],
            from: {
                name: 'Presentación Nueva',
                email: Email
            },
            templateId: OpeCambioNueva,
            dynamic_template_data: {
                Folio: magData.folio,
                CardCode: magData.activos,
                Base: magData.base,
                Refrigeracion: magData.refri ? 'Si' : 'No',
                Caducidad: magData.caducidad,
                Receta: magData.receta ? 'Si' : 'No',
                Exclusiva: magData.excl ? 'Si' : 'No',
                Clasificacion: magData.clasi,
                Comentarios: magData.comCli,
                precio1: magData.precio1,
                precio2: magData.precio2,
                precio3: magData.precio3,
                precio4: magData.precio4,
                precio5: magData.precio5,
                precio6: magData.precio6,
                precio7: magData.precio7,
                precio8: magData.precio8,
                Envases: magData.envases
            }
        }
        const sendMail = async () => {
            try {
                console.log("Correo Enviado Proceso F Ope");
                await sendgrid.send(procesoOpe);
            } catch (error) {
                console.error(error);
                if (error.response) {
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

async function saveMagisOpe(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
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
        magData.StatusGeneral = "Finalizado";
        magData.finishDategc = new Date();
        sendgrid.setApiKey(Apisendgrind);
        const formulaNueva = {
            to: magData.asesor,
            from: {
                name: 'Presentación Nueva',
                email: Email
            },
            templateId: CambioFinalizado,
            dynamic_template_data: {

            }
        }
        const sendMail = async () => {
            try {
                console.log('Correo de Cotizacion nueva enviado');
                await sendgrid.send(formulaNueva);
            } catch (error) {
                console.error(error);
                if (error.response) {
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

async function saveMagisCome(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
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


/////
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

async function canceleMag(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
        magData.StatusGeneral = 'Cancelado';
        magData.sIyD = false
        magData.sOp = false
        magData.sCom = false
        magData.cancelDate = new Date();
        sendgrid.setApiKey(Apisendgrind)
        console.log(magData.asesor);
        const procesoCancelacion = {
            to: magData.asesor,
            from: {
                name: 'Cancelación de Cotización',
                email: Email
            },
            templateId: CancelMag,
            dynamic_template_data: {
                folio: magData.folio,
                motivo: magData.MotivoCancel
            }
        }
        const sendMail = async () => {
            try {
                console.log("Correo de Cancelacion Enviado");
                await sendgrid.send(procesoCancelacion);
            } catch (error) {
                console.error(error);
                if (error.response) {
                    console.error(error.response.body);
                }
            }
        }
        sendMail();
        const cancelarMag = await Mag.findByIdAndUpdate({ _id: id }, magData, { new: true })
        if (!cancelarMag) {
            res.status(404).send({ msg: "Cotización no encontrada" });
        } else {
            res.status(200).send({ msg: "Cancelación Exitosa" })
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar la información" })
        console.log(error);
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
    try {
        const { page = 1, limit = 10, actividad } = req.query;
        let query = {};
        const options = {
            page,
            limit: parseInt(limit),
            sort: { created_at: -1 }
        };
        if (actividad) {
            query.actividad = actividad;
        }
        //console.log(options);
        //console.log(actividad);
        Mag.paginate(query, options, (error, mags) => {
            if (error) {
                res.status(400).send({ msg: "Error al obtener la información", error })
            } else {
                res.status(200).send(mags);
                //console.log("Opciones: ",options);
                //console.log("Actividad: ",actividad);
            }
        });
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
            sort: { fecha: -1 }
        };
        if (actividad) {
            query.actividad = actividad;
        }
        if (asesor) {
            query.asesor = asesor;
        }
        Mag.paginate(query, options, (error, mags) => {
            if (error) {
                res.status(400).send({ msg: "Error al obtener la información", error });
            } else {
                res.status(200).send(mags);
            }
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send({ msg: "Error en el servidor" });
    }
}


async function updateMag(req, res) {
    try {
        const { id } = req.params;
        const magData = req.body;
        //console.log(magData.asesor);
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

const sqlConfig = {
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    server: SQL_SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 40000
    },
    options: {
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
        connectTimeout: 40000,
        port: 1433
    }
}

const appPool = new sql.ConnectionPool(sqlConfig);

async function envases(req, res) {
    try {
        await appPool.connect();
        const query = `SELECT IndexID, FldValue FROM UFD1 WHERE FieldID = 1 AND TableID = 'RDR1' AND IndexID not in (0,1,2,10)`
        const consulta = await appPool.request().query(query);
        res.json(consulta.recordset)
    } catch (error) {
        console.error(error);
        res.status(400).send({ msg: "Error al obtener la información", error })
    } finally {
        await appPool.close();
        console.log("Conexion Cerrada");
    }
}



module.exports = {
    createMag,
    getMag,
    updateMag,
    saveMagIyD,
    saveMagOpe,
    saveMagCome,
    updateMagInyDe,
    updateMagOpe,
    updateMagCome,
    deleteMag,
    getMagbyCardcode,
    getMagbyAsesor,
    getMagbyActvidad,
    getMagbyActvidadyAsesor,
    saveMagiInyDe,
    saveMagiOpe,
    saveMagiCome,
    updateMagiCome,
    updateMagiInyDe,
    updateMagiOpe,
    updateMagisOpe,
    saveMagisInyDe,
    saveMagisOpe,
    saveMagisCome,
    updateMagisInyDe,
    updateMagisCome,
    canceleMag,
    envases
}