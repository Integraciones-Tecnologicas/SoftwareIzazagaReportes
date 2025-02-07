import express, { json } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(json());

app.post('/api/login', async (req, res) => {
  try {
    const { Cuenta, Password } = req.body;
    const response = await axios.post(
      'http://192.168.0.12/SISLocatarios01.NETFrameworkEnvironment/APIDatos/Login',
      { Cuenta: Cuenta, Password: Password },
      {
        headers: {
          'Content-Type': 'application/json', // Asegúrate de enviar las cabeceras correctas
        },
      }
    );
    res.status(200).json(response.data);

  } catch (error) {
    console.error('Error en el servidor proxy:', error);
    if (error.response) {
      res.status(error.response.status).json({ message: error.response.data.message });
    } else if (error.request) {
      res.status(500).json({ message: 'No se recibió respuesta del servidor backend' });
    } else {
      res.status(500).json({ message: 'Error al configurar la solicitud' });
    }
  }
});

app.get('/api/locatario/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extraer el ID de los parámetros de la URL
    console.log(`Solicitud recibida para el locatario con ID: ${id}`);

    // Hacer la solicitud GET al servidor backend
    const response = await axios.get(
      `http://192.168.0.12/SISLocatarios01.NETFrameworkEnvironment/APIDatos/Locatario/${id}`
    );

    // Enviar la respuesta del servidor backend al cliente
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error en el servidor proxy:', error);
    if (error.response) {
      res.status(error.response.status).json({ message: error.response.data.message });
    } else if (error.request) {
      res.status(500).json({ message: 'No se recibió respuesta del servidor backend' });
    } else {
      res.status(500).json({ message: 'Error al configurar la solicitud' });
    }
  }
})

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});