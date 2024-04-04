const {Pool} = require('pg');
const {PG_HOST, PG_USER, PG_PASSWORD, PG_DATABASE, PG_PORT} = require("../constants");


const pool = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DATABASE,
    password: PG_PASSWORD,
    port: PG_PORT
});

async function getReporteKeyla(req, res){
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const offset = (page - 1)*limit;
        const values = [limit, offset];
        const query = `SELECT * FROM vw_reportekeyla LIMIT $1 OFFSET $2`
        const reportekeyla = await pool.query(query, values);
        res.json(reportekeyla.rows)
    } catch (error) {
        console.log(error);
        res.status(400).send({msg: "Error al obtener la información", error})
    }
}

async function getReporteK(req,res){
    try {
        const response = await pool.query("SELECT * FROM vw_reportekeyla")
        res.json(response.rows)
    } catch (error) {
        console.log(error);
        res.status(400).send({msg: "Error al obtener la información", error})
    }
}

module.exports={
    getReporteKeyla,
    getReporteK
}
