const mongoose = require("mongoose");
require('dotenv').config();
const app = require("./app");
const cors = require('cors');
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  API_VERSION,
  IP_SERVER,
} = require("./constants");

const PORT = process.env.POST || 8080;

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log('La conexión con la base de datos MONGODB ha sido exitosa.');
    app.listen(PORT, () => {
      console.log('API REST')
      console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}/`)
    })
  } catch (err) {
    console.log('Error al conectar a la base de datos', err);
  }
}

app.use(cors({
  origin: 'https://kaapaomicron.net',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
}));

connectDB();

app.get(`/`, (req, res) => {
  res.send("Si jala")
});