//Conexion a MONGODB
const DB_USER ="soportesistemas";
const DB_PASSWORD = "dch77x9Kq2Di9R7n";
const DB_HOST = "formulasnuevas.yythhzv.mongodb.net";
const API_VERSION = "v1";
const IP_SERVER="localhost";
const JWT_SECRET_KEY = "GgLXeLCBfLr9CY9vYU2oOpjkWUR2D1pLHAniziVhKvZYNUud6VZC"
const mongoDBString="mongodb+srv://<user>:<password>@kaapadb-prod.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"

/*
//Conexion a COSMOS
const DB_USER ="arnaldo";
const DB_PASSWORD = "StOl2019";
const DB_HOST = "kaapadb-prod.mongocluster.cosmos.azure.com";
const API_VERSION = "v1";
const IP_SERVER="localhost";
const JWT_SECRET_KEY = "GgLXeLCBfLr9CY9vYU2oOpjkWUR2D1pLHAniziVhKvZYNUud6VZC"
const mongoDBString="mongodb+srv://<user>:<password>@kaapadb-prod.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"
*/
/*conexion a Postgresql
const {Pool} = require('pg');
const PG_CONEXION = new Pool({
    PG_USER:"carlo_banuelos@omicrondxpprod",
    PG_PASSWORD: "QK5aV315J5",
    PG_HOST: "omicrondxpprod.postgres.database.azure.com",
    PG_DATABASE: "omicron_dxp",
    PG_PORT: 5432,
})
*/
//Prueba a Conexion a Postgresql
const PG_USER = "carlo_banuelos@omicrondxpprod";
const PG_PASSWORD = "QK5aV315J5";
const PG_HOST = "omicrondxpprod.postgres.database.azure.com";
const PG_DATABASE = "omicron_dxp";
const PG_PORT = 5432



module.exports={
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    API_VERSION,
    IP_SERVER,
    JWT_SECRET_KEY,
    //PG_CONEXION,
    PG_USER,
    PG_HOST,
    PG_PASSWORD,
    PG_DATABASE,
    PG_PORT,
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 1000
    }
};