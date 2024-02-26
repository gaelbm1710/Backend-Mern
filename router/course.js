const express= require("express");
const CourseController = require("../Controllers/course");
const multiparty = require("connect-multiparty");
const md_auth = require("../middlewares/authenticated");
const md_upload = multiparty({ uploadDir:"./uploads/course"})

const api = express.Router();

api.post("/course",[md_auth.asureAuth, md_upload],CourseController.createCourse);
api.get("/course",CourseController.getCourse);
api.patch("/course/:id", [md_auth.asureAuth, md_upload],CourseController.updateCurso);
api.delete("/course/:id",[md_auth.asureAuth],CourseController.deleteCurso);


module.exports=api;