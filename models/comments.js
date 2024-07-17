const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ReplySchema = mongoose.Schema({
    author: String,
    reply: String,
    response_at: { type: Date, default: Date.now }
})

const CommentSchema = mongoose.Schema({
    author: String,
    comment: String,
    created_at: { type: Date, default: Date.now },
    replies: [ReplySchema],
    rate: Number
})

CommentSchema.plugin(mongoosePaginate)


module.exports = mongoose.model("Comentarios", CommentSchema)