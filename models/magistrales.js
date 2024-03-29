const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2");

const MagSchema = mongoose.Schema({
    folio_IyD: Number,
    folio_Op: Number,
    folio_sCom: Number,
    asesor: {
        type: String,
        ref: 'User'
    },
    cardcode: String,
    base: String,
    activos: String,
    especialidad: String,
    padecimiento: String,
    necesita_muestra: Boolean,
    existe: Boolean,
    base_ex: String,
    clave_ex: String,
    presentacion: String,
    created_at: Date,
    sIyD: Boolean,
    sOp: Boolean,
    sCom: Boolean,
    refri: Boolean,
    clasi: String,
    receta: Boolean,
    infoDesa: String,
    tipoF: String,
    precioUni: Number,
    precio1: Number,
    precio2: Number,
    precio3: Number,
    precio4: Number,
    precio5: Number,
    precio6: Number,
    precio7: Number,
    precio8: Number,
    comInt: String,
    caducidad: Number,
    excl: Boolean,
    comClie: String,
    StatusGeneral: Boolean,
    actividad: String
});

MagSchema.plugin(mongoosePaginate);

module.exports=mongoose.model("Mag", MagSchema);