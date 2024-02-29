const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2");

const MagSchema = mongoose.Schema({
    folio_IyD: Number,
    folio_Op: Number,
    folio_sCom: Number,
    asesor: String,
    cardcode: String,
    base: String,
    activos: String,
    especialidad: String,
    padecimiento: String,
    necesita_formula: Boolean,
    existe: Boolean,
    base_ex: String,
    clave_ex: String,
    presentacion: String,
    created_at: Date,
    sIyD: Boolean,
    sOp: Boolean,
    sCom: Boolean
});

MagSchema.plugin(mongoosePaginate);

module.exports=mongoose.model("Mag", MagSchema);