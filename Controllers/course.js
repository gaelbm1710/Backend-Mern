const Course = require("../models/course");
const image = require("../utils/image");

async function createCourse(req, res) {
    try {
        const course = new Course(req.body);
        const imagePath = image.getFilePath(req.files.miniature);
        course.miniature = imagePath;
        const courseStored = await course.save();
        res.status(200).send({ msg: "Curso creado",courseStored});
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el curso"});
    }
}

async function getCourse(req, res) {
    const {page = 1, limit = 10} = req.query;
    const options = {
        page,
        limit: parseInt(limit),
    };
    Course.paginate({}, options, (error, courses)=> {
        if(error) {
            res.status(400).send({ msg: "Error al obtener la información", error });
        } else {
            res.status(200).send(courses);
        }
    });
}

async function updateCurso(req, res) {
    try {
        const { id } = req.params;
        const courseData = req.body;
        if (req.files.miniature) {
            const imagePath = image.getFilePath(req.files.miniature);
            courseData.miniature = imagePath;
        }
        const updatedCourse = await Course.findByIdAndUpdate({ _id: id }, courseData, { new: true });
        if (!updatedCourse) {
            res.status(404).send({ msg: "Curso no encontrado" });
        } else {
            res.status(200).send({ msg: "Actualización exitosa", updatedCourse });
        }
    } catch (error) {
        res.status(400).send({ msg: "Error al actualizar la información", error });
    }
}

async function deleteCurso(req,res){
    const { id } = req.params;
    try{
        const deleteCurso = await Course.findByIdAndDelete(id);
        if(deleteCurso){
            res.status(200).send({msg: "Curso eliminado"});
        }else{
            res.status(400).send({msg: "Curso no encontrado"});
        }
    }catch (error){
        res.status(500).send({msg:"Error al eliminar curso"});
    }
}


module.exports={
    createCourse,
    getCourse,
    updateCurso,
    deleteCurso,
}