const mongoose = require("mongoose");
const app = require("./app");
const {Pool} =  require("pg")
const{
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    API_VERSION,
    IP_SERVER,
    PG_CONEXION 
} = require("./constants");

const PORT = process.env.POST || 3977

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/`)

    console.log('La conexión con la base de datos MONGODB ha sido exitosa.');
    app.listen(PORT, () => {
      console.log('API REST')
      console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}/`)
    })
  } catch (err) {
    console.log('Error al conectar a la base de datos', err);
  }
}


const connectPG = async () =>{
  try {
    const pool = new Pool(PG_CONEXION)
    console.log('La conexión con la base de datos POSTGRESQL ha sido exitosa.');
  } catch (error) {
    console.log("Error al conectarse a la base de datos de PostgreSQL ", error);
  }
}

connectDB();
connectPG();

app.get("/",(req, res) =>{
  res.send("Si jala")
});