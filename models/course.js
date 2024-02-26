const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const CourseSchema = mongoose.Schema({
    tittle: String,
    miniature: String,
    description: String,
    url: String,
});

CourseSchema.plugin(mongoosePaginate);

module.exports=mongoose.model("Course",CourseSchema);