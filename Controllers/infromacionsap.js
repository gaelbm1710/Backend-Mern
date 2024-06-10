const sql = require('mssql')
const { SQL_DATABASE, SQL_PASSWORD, SQL_PORT, SQL_SERVER, SQL_USER } = require("../constants");

const sqlConfig = {
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    server: SQL_SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

const appPool = new sql.ConnectionPool(sqlConfig)

async function connectMSSQL(req, res) {
    try {
        const query = 'SELECT * FROM OITB'
        const consulta = await appPool.query(query);
        res.json(consulta.rows)
        console.log("Conexion a SAP");
    } catch (error) {
        console.log("Error ", error);
        res.status(400).send({ msg: "Error al obtener la información", error })
    }
}


module.exports = {
    connectMSSQL,
}
