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

async function getReporteTranscredito(req, res){
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const offset = (page - 1)*limit;
        const values = [limit, offset];
        const query = ` SELECT * FROM vw_reportecredito LIMIT $1 OFFSET $2`
        const reportekeyla = await pool.query(query, values);
        res.json(reportekeyla.rows)
    } catch (error) {
        console.log(error);
        res.status(400).send({msg: "Error al obtener la información", error})
    }
}

async function getClientesCredito(req, res){
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const offset = (page - 1)*limit;
        const values = [limit, offset];
        const query = `select u.cardcode, u.nombre,
        case
            when c.creditrulesid in (7,19,20,28,6,11,29,23,30,15,31,32,27) then 'Regla de días'
            when c.creditrulesid in (33,2,3,4,5,10,12,13,14,16,17,18,21,22,24,25,26,1,8,9) then 'Regla de cantidad'
        end as "Regla",
        case 
            when c.creditrulesid in (7,19,20,28,6,11,29,23,30,15,31,32,27) then CONCAT(ROUND(C2.value), ' Dias')
            when c.creditrulesid in (33,2,3,4,5,10,12,13,14,16,17,18,21,22,24,25,26,1,8,9) then CONCAT('$', ROUND(C2.value))
        end Valor,
        c.consumed consumido
        from creditrulesdetails c join userslistinsert u on c.cardcode = u.cardcode
        join creditrules c2 on c2.id = c.creditrulesid LIMIT $1 OFFSET $2`
        const reportekeyla = await pool.query(query, values);
        res.json(reportekeyla.rows)
    } catch (error) {
        console.log(error);
        res.status(400).send({msg: "Error al obtener la información", error})
    }
}

async function getPagosFacturas(req, res){
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const offset = (page - 1)*limit;
        const values = [limit, offset];
        const query = `select u.cardcode, u.nombre, to_char(i.createdate, 'YYYY-MM-DD') as Fecha_Creacion, to_char(i.paydate, 'YYYY-MM-DD') as Fecha_Pago, 
        i.status, i2.invoiceid Factura, i.totalcost Total_Factura, u.correo, 
        case 
            when paymentmethod -> 'PaymentMethod' ->> 'Object' = 'bbvamulti' and paymentmethod -> 'PaymentMethod' ->> 'Type' = 'TDX' then 'BBVA TARJETA CREDITO/DEBITO'
            when paymentmethod -> 'PaymentMethod' ->> 'Object' = 'bbvamulti' and paymentmethod -> 'PaymentMethod' ->> 'Type' = 'CIE' then 'BBVA CIE INTERBANCARIO'
            when paymentmethod -> 'PaymentMethod' ->> 'Object' = 'bbvamulti' and paymentmethod -> 'PaymentMethod' ->> 'Type' = 'CIE_INTER' then 'BBVA SPEI BBVA'
            when paymentmethod -> 'PaymentMethod' ->> 'Object' = 'bbvamulti' and paymentmethod -> 'PaymentMethod' ->> 'Type' = 'SUC' then 'BBVA PRACTICAJA/SUCURSAL'
            when paymentmethod -> 'PaymentMethod' ->> 'Brand' = '' and paymentmethod  -> 'PaymentMethod' ->> 'Object' = 'credit_payment' then 'Crédito'
            when paymentmethod -> 'PaymentMethod' ->> 'Object' = 'card_payment' and paymentmethod -> 'PaymentMethod' ->> 'Type' = 'debit' then 'Tarjeta Débito'
            when paymentmethod -> 'PaymentMethod' ->> 'Object' = 'card_payment' and paymentmethod -> 'PaymentMethod' ->> 'Type' = 'credit' then 'Tarjeta Crédito'
            when paymentmethod -> 'PaymentMethod' ->> 'Object' = 'cash_payment' then 'Oxxo'
            when paymentmethod -> 'PaymentMethod' ->> 'Object' = 'bank_transfer_payment' then 'SPEI'
            when paymentmethod -> 'PaymentMethod' ->> 'Object' = 'paypal' then 'Paypal'
            else 'Revisar en SAP'
        end as Metodo_pago
        from invoicepayments i left join userslistinsert u on i.cardcode = u.cardcode left join invoicepaymentdetail i2 on i.transactionid = i2.transactionid
        order by i.createdate desc LIMIT $1 OFFSET $2`
        const reportekeyla = await pool.query(query, values);
        res.json(reportekeyla.rows)
    } catch (error) {
        console.log(error);
        res.status(400).send({msg: "Error al obtener la información", error})
    }
}

module.exports={
    getReporteKeyla,
    getReporteK,
    getReporteTranscredito,
    getClientesCredito,
    getPagosFacturas
}
