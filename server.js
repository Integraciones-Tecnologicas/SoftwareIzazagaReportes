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

//Iniciar Sesión
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

//Buscar locatario por ID
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

//Buscar locatario por nombre
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

//Crear locatario
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

//Buscar todos los productos por locatario
app.get("/productos", async (req, res) => {
  try {
    const response = await axios.get(
      `${APICatalogos}/Productos`,
      { params: { LocatarioId: 0 } }
    );

    res.json(response.data); // Enviar datos al cliente
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

//Buscar producto por Locatarioid y Prodssku
app.get('/api/buscar-producto', async (req, res) => {
  try {
    const { Locatarioid, Prodssku } = req.query; // Obtener los parámetros "Locatarioid" y "Prodssku" de la consulta

    if (!Locatarioid || !Prodssku) {
      return res.status(400).json({ message: 'Los parámetros "Locatarioid" y "Prodssku" son requeridos' });
    }

    const response = await axios.get(
      `${APICatalogos}/BuscaProd`, 
      { params: { Locatarioid, Prodssku } }
    );

    res.status(200).json(response.data); // Devolver los datos obtenidos desde la API externa
  } catch (error) {
    console.error('Error al buscar producto:', error);
    if (error.response) {
      res.status(error.response.status).json({ message: error.response.data.message });
    } else if (error.request) {
      res.status(500).json({ message: 'No se recibió respuesta del servidor backend' });
    } else {
      res.status(500).json({ message: 'Error al configurar la solicitud' });
    }
  }
});


//Crear un producto
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

//Eliminar producto
app.get('/api/eliminar-producto', async (req, res) => {
  try {
    const { Locatarioid, Prodssku } = req.query; // Obtener parámetros de la consulta

    if (!Locatarioid || !Prodssku) {
      return res.status(400).json({ message: 'Los parámetros "Locatarioid" y "Prodssku" son requeridos' });
    }

    const response = await axios.get(
      `${APICatalogos}/EliminaProd?Locatarioid=${Locatarioid}&Prodssku=${Prodssku}`
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

//Actualizar producto
app.post('/api/actualizar-producto', async (req, res) => {
  try {
    const productoData = req.body; // Los datos del producto vienen en el cuerpo de la solicitud

    const response = await axios.post(
      `${APICatalogos}/ActualizaProd`,
      {
        SDTProd: {
          ProdId: productoData.ProdId,
          LocatarioId: productoData.LocatarioId,
          ProdsSKU: productoData.ProdsSKU,
          ProdsDescrip: productoData.ProdsDescrip,
          ProdsLinea: productoData.ProdsLinea,
          ProdsFamilia: productoData.ProdsFamilia,
          ProdsCosto: productoData.ProdsCosto,
          ProdsPrecio1: productoData.ProdsPrecio1,
          ProdsPrecio2: productoData.ProdsPrecio2,
          ProdsPrecio3: productoData.ProdsPrecio3,
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

// Crear una parte de entrada
app.post('/api/crear-part-entrada', async (req, res) => {
  try {
    const { EntradaId, PartEntProdId, PartEntCant, PartEntCheck, PartEntObserv } = req.body;

    // Llamar al endpoint CrearPartEntrada en el servidor externo
    const response = await axios.post(
      `${APIDatos}/CrearPartEntrada`,
      {
        SDTPartEntrada: {
          EntradaId,
          PartEntProdId,
          PartEntCant,
          PartEntCheck,
          PartEntObserv,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Respuesta del servidor externo:", response.data); // Verifica la respuesta del servidor externo

    res.status(200).json(response.data); // Envía la respuesta del servidor externo
  } catch (error) {
    console.error('Error al crear parte de entrada:', error);
    if (error.response) {
      res.status(error.response.status).json({ message: error.response.data.message });
    } else if (error.request) {
      res.status(500).json({ message: 'No se recibió respuesta del servidor backend' });
    } else {
      res.status(500).json({ message: 'Error al configurar la solicitud' });
    }
  }
});

// Crear una entrada
app.post('/api/crear-entrada', async (req, res) => {
  try {
    const { SDTEntrada } = req.body;

    console.log("Datos recibidos en el backend:", SDTEntrada); // Verifica los datos recibidos

    // Validar que SDTEntrada no esté vacío
    if (!SDTEntrada) {
      return res.status(400).json({ message: "SDTEntrada es requerido" });
    }

    // Validar que los campos obligatorios estén presentes
    if (!SDTEntrada.LocatarioId || !SDTEntrada.EntradaFechaCap || !SDTEntrada.EntradaObserv) {
      return res.status(400).json({ message: "Faltan campos obligatorios en SDTEntrada" });
    }

    // Formatear la fecha y la hora
    const fechaFormateada = new Date(SDTEntrada.EntradaFechaCap).toLocaleDateString('en-US'); // Convierte a MM/DD/YYYY
    const horaFormateada = new Date().toLocaleTimeString('en-US', { hour12: false }); // Convierte a HH:mm:ss

    // Llamar al endpoint CrearEntrada en el servidor externo
    const response = await axios.post(
      `${APIDatos}/CrearEntrada`,
      {
        SDTEntrada: {
          ...SDTEntrada,
          EntradaFechaCap: fechaFormateada,
          EntradaHoraCita: horaFormateada,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Respuesta del servidor externo:", response.data); // Verifica la respuesta del servidor externo

    // Construir la respuesta completa
    const respuestaCompleta = {
      EntradaId: response.data.EntradaId,
      LocatarioId: SDTEntrada.LocatarioId,
      LocatarioNombre: SDTEntrada.LocatarioNombre,
      EntradaFechaCap: fechaFormateada, // Usa la fecha formateada
      EntradaHoraCita: horaFormateada, // Usa la hora formateada
      EntradaTipoDuracion: SDTEntrada.EntradaTipoDuracion, // Usa el tipo de duración que enviaste
      EntradaObserv: SDTEntrada.EntradaObserv, // Usa las observaciones que enviaste
      Part: [], // Inicialmente vacío, se llenará con CrearPartEntrada
    };

    console.log("Respuesta completa enviada al frontend:", respuestaCompleta); // Verifica la respuesta completa

    res.status(200).json(respuestaCompleta); // Envía la respuesta completa al frontend
  } catch (error) {
    console.error('Error al crear entrada:', error);
    if (error.response) {
      console.error("Error del servidor externo:", error.response.data);
      res.status(error.response.status).json({ message: error.response.data.message });
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor externo:", error.request);
      res.status(500).json({ message: 'No se recibió respuesta del servidor externo' });
    } else {
      console.error("Error al configurar la solicitud:", error.message);
      res.status(500).json({ message: 'Error al configurar la solicitud' });
    }
  }
});

// Eliminar una entrada
app.get('/api/eliminar-entrada', async (req, res) => {
  try {
    const { Entradaid, PartEntId } = req.query; // Obtener los parámetros de la consulta
    // Validar que los parámetros requeridos estén presentes
    if (!Entradaid || !PartEntId) {
      return res.status(400).json({ message: 'Los parámetros "Entradaid" y "PartEntId" son requeridos' });
    }

    // Hacer la solicitud a la API externa para eliminar la entrada
    const response = await axios.get(
      `${APIDatos}/EliminaEntrada?Entradaid=${Entradaid}&PartEntId=${PartEntId}`
    );

    // Enviar la respuesta al frontend
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error en el servidor proxy:', error);
    if (error.response) {
      // Si el servidor externo devuelve un error
      res.status(error.response.status).json({ message: error.response.data.message });
    } else if (error.request) {
      // Si no se recibió respuesta del servidor externo
      res.status(500).json({ message: 'No se recibió respuesta del servidor backend' });
    } else {
      // Si hubo un error al configurar la solicitud
      res.status(500).json({ message: 'Error al configurar la solicitud' });
    }
  }
});

app.get('/api/entrada/:id', async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID de la entrada desde los parámetros de la URL

    // Hacer la solicitud a la API externa
    const response = await axios.get(
      `${APIDatos}/Entrada/${id}`
    );

    console.log("Respuesta del servidor externo:", response.data); // Verifica la respuesta del servidor externo

    // Enviar la respuesta al frontend
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error al obtener la entrada:', error);
    if (error.response) {
      // Si el servidor externo devuelve un error
      res.status(error.response.status).json({ message: error.response.data.message });
    } else if (error.request) {
      // Si no se recibió respuesta del servidor externo
      res.status(500).json({ message: 'No se recibió respuesta del servidor externo' });
    } else {
      // Si hubo un error al configurar la solicitud
      res.status(500).json({ message: 'Error al configurar la solicitud' });
    }
  }
});

// Obtener entradas pendientes
app.get('/api/entradas-pendientes', async (req, res) => {
  try {
    // Hacer la solicitud a la API externa para obtener las entradas pendientes
    const response = await axios.get(
      `${APIDatos}/EntradasPendientes`
    );

    // Enviar la respuesta al frontend
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error en el servidor proxy:', error);
    if (error.response) {
      // Si el servidor externo devuelve un error
      res.status(error.response.status).json({ message: error.response.data.message });
    } else if (error.request) {
      // Si no se recibió respuesta del servidor externo
      res.status(500).json({ message: 'No se recibió respuesta del servidor backend' });
    } else {
      // Si hubo un error al configurar la solicitud
      res.status(500).json({ message: 'Error al configurar la solicitud' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});