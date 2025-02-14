import express, { json } from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const APIDatos = process.env.APIDatos;
const APICatalogos = process.env.APICatalogos;

app.use(cors());
app.use(json());

app.post('/api/login', async (req, res) => {
  try {
    const { Cuenta, Password } = req.body;
    const response = await axios.post(
      `${APIDatos}/Login`,
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
      `${APIDatos}/Locatario/${id}`
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

app.get('/api/buscar-locatario', async (req, res) => {
  try {
    
    const { nombre} = req.query; // Obtener el parámetro "nombre" de la consulta

    if (!nombre) {
      return res.status(400).json({ message: 'El parámetro "nombre" es requerido' });
    }

    const response = await axios.get(
      `${APIDatos}/BusquedaLocatario?Nombre=${nombre}`
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
      `${APIDatos}/CrearLocatario`,
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

app.get('/api/producto/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Solicitud recibida para el producto con ID: ${id}`);

    const response = await axios.get(
      `${APICatalogos}/Producto/${id}`
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

app.post('/api/crear-producto', async (req, res) => {
  try {
    const productoData = req.body; // Los datos del producto vienen en el cuerpo de la solicitud

    const response = await axios.post(
      `${APICatalogos}/CrearProd`,
      {
        SDTProd: {
          ProdId: "", // Deja vacío para que el servidor lo asigne
          LocatarioId: productoData.LocatarioId,
          ProdsSKU: productoData.ProdsSKU,
          ProdsDescrip: productoData.ProdsDescrip,
          ProdsLinea: productoData.ProdsLinea,
          ProdsFamilia: productoData.ProdsFamilia,
          ProdsCosto: productoData.ProdsCosto,
          ProdsPrecio1: productoData.ProdsPrecio1,
          ProdsPrecio2: productoData.ProdsPrecio1,
          ProdsPrecio3: productoData.ProdsPrecio1,
          ProdsChek1: productoData.ProdsChek1,
          ProdsObserv: productoData.ProdsObserv,
          ProdsExistencia: productoData.ProdsExistencia,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json', // Especifica el tipo de contenido
        },
      }
    );

    res.status(200).json(response.data); // Devuelve la respuesta de la API externa
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