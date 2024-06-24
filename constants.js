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
const Registro = "d-6238b0f277774b30bcda46c2d6eefd37";
const Autorizacion = "d-605e40356a244f21974ecb3f02481e82";

//Plantillas Para Cotización Nueva
const CotizacionNueva = "d-eccc1d3037c04815bb9799dcf00c41a2";
const InydeCotizacionNueva = "d-b5a431a8e25e4938bff65198de562d38";
const OpeCotizacionNueva = "d-be8fd2e3e28743ad9d3da7c742f57430";
const CotizacionFinalizada = "d-4532d593e2c64ad48c78a704ba8600fc";

//Plantillas Para Presentación Nueva
const PresentacionNueva = "d-1782a0674ab1477e9108eed310936fe4";
const InydePresentacionNueva = "d-b5a431a8e25e4938bff65198de562d38";
const PresentacionFinalizada = "d-4532d593e2c64ad48c78a704ba8600fc";

//Plantillas Para Cambio de Base
const cambioNuevo = "d-bc93e0a1373d4e6d925198dd10a524ca";
const InydeCambioNuevo = "d-b5a431a8e25e4938bff65198de562d38";
const OpeCambioNueva = "d-be8fd2e3e28743ad9d3da7c742f57430";
const CambioFinalizado = "d-4532d593e2c64ad48c78a704ba8600fc";

//Plantilla De Cancelación de Solicitud
const CancelMag = "d-1d729503228a47629825b547b9164bc9";

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