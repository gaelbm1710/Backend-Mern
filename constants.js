require('dotenv').config();


//Desarrollo -------> Conexion a MONGODB
const DB_USER = process.env.AT_USER;
const DB_PASSWORD = process.env.AT_PASSWORD;
const DB_HOST = process.env.AT_HOST;
const API_VERSION = process.env.AT_API_VERSION;
const IP_SERVER = process.env.AT_IP_SERVER;
const JWT_SECRET_KEY = process.env.AT_JWT_SECRET_KEY;
const mongoDBString = process.env.AT_mongoDBString
//*/
/*
//PRODUCCION -------> Conexion a COSMOS YA funciona
const DB_USER = process.env.CO_DB_USER;
const DB_PASSWORD = process.env.CO_DB_PASSWORD;
const DB_HOST = process.env.CO_DB_HOST;
const API_VERSION = process.env.CO_API_VERSION;
const IP_SERVER = process.env.CO_IP_SERVER;
const JWT_SECRET_KEY = process.env.CO_JWT_SECRET_KEY;
const mongoDBString = process.env.CO_mongoDBString;
//*/

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

//Plantilla De Cancelación de Solicitud
const CancelMag = "d-8b9a5c1259c64a8e86ddf02c93a20590";

//Azure Contenedor
const ConexionContenedor = process.env.AZURE_STORAGE_CONNECTION_STRING;

//Plantilla DE Ticket De Soporte




//Conexion a Postgresql
const PG_USER = process.env.PG_USER;
const PG_PASSWORD = process.env.PG_PASSWORD;
const PG_HOST = process.env.PG_HOST;
const PG_DATABASE = process.env.PG_DATABASE;
const PG_PORT = process.env.PG_PORT;

//Conexion a SQL SERVER
const SQL_USER = process.env.MSSQL_USER;
const SQL_PASSWORD = process.env.MSSQL_PASSWORD;
const SQL_SERVER = process.env.MSSQL_SERVER;
const SQL_DATABASE = process.env.MSSQL_DATABASE;
const SQL_PORT = process.env.MSSQL_PORT;

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
    SQL_USER,
    SQL_PASSWORD,
    SQL_SERVER,
    SQL_DATABASE,
    SQL_PORT,
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
    ConexionContenedor,
    CancelMag
};