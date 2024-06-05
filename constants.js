require('dotenv').config();


//Conexion a MONGODB
const DB_USER = "soportesistemas";
const DB_PASSWORD = "dch77x9Kq2Di9R7n";
const DB_HOST = "formulasnuevas.yythhzv.mongodb.net";
const API_VERSION = "v1";
const IP_SERVER = "localhost";
const JWT_SECRET_KEY = "GgLXeLCBfLr9CY9vYU2oOpjkWUR2D1pLHAniziVhKvZYNUud6VZC"
const mongoDBString = "mongodb+srv://<user>:<password>@kaapadb-prod.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"


/*
//Conexion a COSMOS YA funciona
const DB_USER = "dbuser";
const DB_PASSWORD = "Paulina123";
const DB_HOST = "kaapadb-mongo.mongocluster.cosmos.azure.com";
const API_VERSION = "v1";
const IP_SERVER = "localhost";
const JWT_SECRET_KEY = "GgLXeLCBfLr9CY9vYU2oOpjkWUR2D1pLHAniziVhKvZYNUud6VZC"
const mongoDBString = "mongodb+srv://dbuser:Paulina123@kaapadb-mongo.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";
*/
//Servicio de correo
const Apisendgrind = process.env.SENDGRID_API_KEY;
const Email = "soporte.sistemas@o-lab.mx" /// Cambiar a correo de notificaciones
const Registro = "d-8e8c1968c6ca4f90acaaace0d18116c0";
const Autorizacion = "d-6a66e908ed99452f9ffc0e32c2dd02d1";

//Plantillas Para Cotización Nueva
const CotizacionNueva = "d-ee0958ca2fbd4f74a12655aadb91732a";
const InydeCotizacionNueva = "d-81d628a74e114e999ad3122b69f1a310";
const OpeCotizacionNueva = "d-300b3f3e1c2544a1a8b1d615df789b31";
const CotizacionFinalizada = "d-417bd2f630454d948e07722b45ca2da0";

//Plantillas Para Presentación Nueva
const PresentacionNueva = "d-f430fa43ba8e439fb1e98cbdbdb7ea2f";
const InydePresentacionNueva = "d-81d628a74e114e999ad3122b69f1a310";
const PresentacionFinalizada = "d-417bd2f630454d948e07722b45ca2da0";

//Plantillas Para Cambio de Base
const cambioNuevo = "d-3652399085a74f7bb87774ca0ad5f26b";
const InydeCambioNuevo = "d-81d628a74e114e999ad3122b69f1a310";
const OpeCambioNueva = "d-300b3f3e1c2544a1a8b1d615df789b31";
const CambioFinalizado = "d-417bd2f630454d948e07722b45ca2da0";


//Azure Contenedor
const ConexionContenedor = process.env.AZURE_STORAGE_CONNECTION_STRING;



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
const PG_USER = process.env.PG_USER;
const PG_PASSWORD = process.env.PG_PASSWORD;
const PG_HOST = process.env.PG_HOST;
const PG_DATABASE = process.env.PG_DATABASE;
const PG_PORT = process.env.PG_PORT;



module.exports = {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    API_VERSION,
    IP_SERVER,
    JWT_SECRET_KEY,
    mongoDBString,
    //PG_CONEXION,
    PG_USER,
    PG_HOST,
    PG_PASSWORD,
    PG_DATABASE,
    PG_PORT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 1000
    },
    Apisendgrind,
    Email,
    Registro,
    Autorizacion,
    CotizacionNueva,
    InydeCotizacionNueva,
    CotizacionFinalizada,
    OpeCotizacionNueva,
    PresentacionNueva,
    InydePresentacionNueva,
    PresentacionFinalizada,
    cambioNuevo,
    CambioFinalizado,
    InydeCambioNuevo,
    OpeCambioNueva,
    ConexionContenedor
};