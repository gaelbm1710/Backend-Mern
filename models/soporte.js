const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SoporteSchema = mongoose.Schema({
    documentos: String,
    servicio: String,
    descripcion: String,
    dueno: String,
    asignado: String,
    estado: String,
    comentarios: String,
    created_at: Date,
});

SoporteSchema.plugin(mongoosePaginate);

module.exports=mongoose.model("Soporte",SoporteSchema);