import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from 'mssql';
const { connect } = pkg;


dotenv.config(); // Cargar variables de entorno

const app = express();
app.use(cors()); 
app.use(express.json()); // Manejar datos en formato JSON

// Configuración de la base de datos
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false, // Desactivar encriptación SSL
        trustServerCertificate: true, // Confía en el certificado del servidor
    },
    port: parseInt(process.env.DB_PORT),
};

// Ruta para obtener datos de la base de datos
app.get("/api/data", async (req, res) => {
    try {
        const pool = await connect(dbConfig); // Conectar a la base de datos
        const result = await pool.request().query("SELECT * FROM dbo.almacen"); 
        res.json(result.recordset); // Enviar datos al frontend
    } catch (error) {
        console.error("Error al consultar la base de datos:", error);
        res.status(500).send("Error al conectar con la base de datos");
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
