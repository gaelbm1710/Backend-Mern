const express = require("express");
const PG_CONEXION = require("../constants")
const {Pool} = require("pg")
const api = express.Router();
const pool = new Pool(PG_CONEXION);

api.get("/conta", async(req,res)=>{
   const result = await pool.query('SELECT NOW()');
   console.log(result);
   res.json('executed')
})



module.exports=api;