import express, { json } from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const BACKEND_URL = process.env.BACKEND_URL;

app.use(cors());
app.use(json());

app.post('/api/login', async (req, res) => {
  try {
    const { Cuenta, Password } = req.body;
    const response = await axios.post(
      `${BACKEND_URL}/Login`,
      { Cuenta: Cuenta, Password: Password },
      {
        headers: {
          'Content-Type': 'application/json',
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
    const { id } = req.params;
    console.log(`Solicitud recibida para el locatario con ID: ${id}`);

    const response = await axios.get(
      `${BACKEND_URL}/Locatario/${id}`
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

app.post('/api/locatario', async (req, res) => {
  try {
    const locatarioData = req.body; // Los datos del locatario vienen en el cuerpo de la solicitud

    const response = await axios.post(
      'http://192.168.0.12/SISLocatarios01.NETFrameworkEnvironment/APIDatos/CrearLocatario',
      {
        SDTLocatario: {
          LocatarioNombre: locatarioData.LocatarioNombre,
          LocatarioDireccion: locatarioData.LocatarioDireccion,
          LocatarioEmail: locatarioData.LocatarioEmail,
          UsuId: "0",
          LocatarioTelefono: locatarioData.LocatarioTelefono,
          LocatarioTel2: locatarioData.LocatarioTel2,
          LocatarioRFC: locatarioData.LocatarioRFC,
          LocatarioNomContacto: locatarioData.LocatarioNomContacto,
          LocatarioTelContacto: locatarioData.LocatarioTelContacto,
          LocatarioActivo: "S",
          LocatarioObservacion: locatarioData.LocatarioObservacion || ''
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
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

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});