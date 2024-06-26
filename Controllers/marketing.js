const sql = require('mssql')
const { Pool } = require('pg');
const { SQL_DATABASE, SQL_PASSWORD, SQL_PORT, SQL_SERVER, SQL_USER } = require("../constants");
const { PG_HOST, PG_USER, PG_PASSWORD, PG_DATABASE, PG_PORT } = require("../constants");
const xl = require('excel4node');

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
const pool = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DATABASE,
    password: PG_PASSWORD,
    port: PG_PORT
});

const appPool = new sql.ConnectionPool(sqlConfig)

async function connectMSSQL(req, res) {
    try {
        await appPool.connect();
        const query = 'SELECT * FROM OITB'
        const consulta = await appPool.request().query(query);
        res.json(consulta.recordset)
    } catch (error) {
        console.log("Error ", error);
        res.status(400).send({ msg: "Error al obtener la información", error })
    } finally {
        await appPool.close();
        console.log("Conexion finalizada");
    }
}
//Consultas Generales
async function ConsultaFacturas(req, res) {
    try {
        await appPool.connect();
        const query = `SELECT CardCode, DocNum, CAST(DocDate AS DATE) AS 'Fecha_Factura', U_Pedido_DXP 
        FROM OINV ORDER BY DocNum DESC`
        const consulta = await appPool.request().query(query);
        res.json(consulta.recordset);
    } catch (error) {
        console.log("Error: ", error);
        res.status(400).send({ msg: "Error al obtener la información ", error })
    } finally {
        await appPool.close();
        console.log("Conexion finalizada");
    }
}

async function ReportePromociones(req, res) {
    try {
        const response = await pool.query("SELECT * FROM vw_reportepromociones");
        res.json(response.rows);
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: "Error al obtener la información ", error })
    }
}

async function CategoriaPromociones(req, res) {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const offset = (page - 1) * limit;
        const values = [limit, offset];
        const query = `select p1.id, p1.code, p2."type" as "tipo_promocion",p3."type" as "tipo_descuento",
case
	when p3."type" = 'Porcentaje' then CONCAT(p1.discount, '%')
	when p3."type" = 'Monto' then CONCAT('$',p1.discount)
end "Descuento",
case
	when p1.active = 1 then 'Activo'
	else 'Inactivo'
end "Estado",
to_char(p1.startdate,'YYYY-MM-DD') "Fecha_Inicio", to_char(p1.enddate, 'YYYY-MM-DD') "Fecha_Fin"
from promotionalcodes p1 join promotionalcodetypes p2 on p1.promotionalcodetypesid = p2.id
join promotionalcodediscounttypes p3 on p1.promotionalcodediscounttypesid = p3.id order by p1.id
LIMIT $1 OFFSET $2`
        const response = await pool.query(query, values);
        res.json(response.rows)
    } catch (error) {
        res.status(400).send({ msg: "Error al obtener la información ", error })
    }
}

//Exportar Reporte a Excel
async function ExportarConsultaFacturas(req, res) {
    try {
        await appPool.connect();
        const query = `SELECT CardCode, DocNum, CAST(DocDate AS DATE) AS 'Fecha_Factura', U_Pedido_DXP 
        FROM OINV ORDER BY DocNum DESC`;
        const consulta = await appPool.request().query(query);
        if (!consulta.recordset || consulta.recordset.length === 0) {
            throw new Error("No se encontraron datos");
        }
        const data = consulta.recordset.map(row => [
            row["CardCode"],
            row["DocNum"],
            row["Fecha_Factura"] ? new Date(row["Fecha_Factura"]).toLocaleDateString('es-ES') : '',
            row["U_Pedido_DXP"]
        ]);
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('Facturas');
        const style = wb.createStyle({
            font: {
                color: '#000000',
                size: 12
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
        const header = ["CardCode", "DocNum", "Fecha_Factura", "U_Pedido_DXP"];
        header.forEach((headerTitle, index) => {
            ws.cell(1, index + 1).string(headerTitle).style(style);
        });
        data.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (typeof cell === 'number') {
                    ws.cell(rowIndex + 2, cellIndex + 1).number(cell);
                } else {
                    ws.cell(rowIndex + 2, cellIndex + 1).string(cell ? cell.toString() : '');
                }
            });
        });

        wb.write('Facturas.xlsx', res);
    } catch (err) {
        console.error("Error al ejecutar el reporte", err);
        res.status(500).send({ msg: "Error al ejecutar el reporte" });
    }
}


async function ExportarReportePromociones(req, res) {
    try {
        const response = await pool.query("SELECT * FROM vw_reportepromociones");
        if (!response.rows || response.rows.length === 0) {
            throw new Error('No se encontraron datos');
        }

        const data = response.rows.map(row => [
            row["cardcode"],
            row["nombre"],
            row["correo"],
            row["transactionid"],
            row["itemcode"],
            row["totalproducts"],
            row["promotionalcodesid"],
            row["promotionalcodeamout"],
            row["creacion"],
            row["pago"],
            row["totalcost"]
        ]);

        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('Reporte Promociones');
        const style = wb.createStyle({
            font: {
                color: '#000000',
                size: 12
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        const header = ["CardCode", "Nombre", "correo", "TransactionID", "ItemCode", "TotalProducts", "Promotionalcodesid", "promotionalcodeamount", "Creacion", "Pago", "TotalCost"];
        header.forEach((headerTitle, index) => {
            ws.cell(1, index + 1).string(headerTitle).style(style);
        });

        data.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (typeof cell === 'number') {
                    ws.cell(rowIndex + 2, cellIndex + 1).number(cell);
                } else {
                    ws.cell(rowIndex + 2, cellIndex + 1).string(cell ? cell.toString() : '');
                }
            });
        });

        wb.write('ReportePromociones.xlsx', res);

    } catch (err) {
        console.error("Error al ejecutar el reporte", err);
        res.status(500).json({ msg: "Error al ejecutar el reporte" });
    }
}

module.exports = {
    connectMSSQL,
    ConsultaFacturas,
    ReportePromociones,
    CategoriaPromociones,
    ExportarConsultaFacturas,
    ExportarReportePromociones
}
