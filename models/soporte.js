const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SoporteSchema = mongoose.Schema({
    folio: {
        type: Number,
        unique: true
    },
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

SoporteSchema.pre('save',async function (next){
    try {
        const lastticket = await this.constructor.findOne({},{},{sort: {'folio':-1}});
        if(lastticket){
            this.folio = lastticket.folio + 1;
        }else{
            this.folio = 1;
        }
        next();
    } catch (error) {
        next(error);
    }
})

module.exports=mongoose.model("Soporte",SoporteSchema);