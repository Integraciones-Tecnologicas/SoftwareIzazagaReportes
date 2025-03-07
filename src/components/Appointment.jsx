import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import axios from "axios";
import useStore from "../store/store";

const Appointment = () => {
  const location = useLocation();
  const { selectedFolio, tipoDuracion: tipoDuracionFromEntryCapture } = location.state || {}; // Obtener datos pasados desde EntryCapture

  const [errorMessage, setErrorMessage] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [entradasPendientes, setEntradasPendientes] = useState([]); // Lista de entradas pendientes
  const [selectedEntradaId, setSelectedEntradaId] = useState(selectedFolio || ""); // Entrada pendiente seleccionada
  const [tipoDuracion, setTipoDuracion] = useState(""); // Tipo de duración seleccionada (en formato de interfaz)
  const currentUser = useStore((state) => state.currentUser); // Obtén el usuario actual del store
  const locatarioId = currentUser?.locatarioId === 0 ? 2 : currentUser?.locatarioId; // Asignar 2 si locatarioId es 0


  // Mapeo entre los valores de la interfaz y los valores de la base de datos
  const duracionMap = {
    "30 min": "A",
    "1 hora": "B",
    "2 horas": "C",
    A: "30 min",
    B: "1 hora",
    C: "2 horas",
  };

  // Convertir el tipo de duración recibido desde EntryCapture al formato de la interfaz
  useEffect(() => {
    if (tipoDuracionFromEntryCapture) {
      setTipoDuracion(duracionMap[tipoDuracionFromEntryCapture] || "");
    }
  }, [tipoDuracionFromEntryCapture]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const watchDate = watch("date"); // Observar cambios en la fecha seleccionada
  const watchTime = watch("time"); // Observar cambios en la hora seleccionada

  // Obtener las entradas pendientes al cargar el componente
  useEffect(() => {
    const fetchEntradasPendientes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/entradas-pendientes`);
        setEntradasPendientes(response.data.SDTEntradas); // Almacenar las entradas pendientes en el estado
      } catch (error) {
        console.error("Error al obtener las entradas pendientes:", error);
      }
    };

    fetchEntradasPendientes();
  }, []);

  // Calcular los horarios disponibles para la fecha seleccionada
  useEffect(() => {
    if (watchDate) {
      const times = calculateAvailableTimes(watchDate);
      setAvailableTimes(times);
    } else {
      setAvailableTimes([]); // Limpiar los horarios si no hay fecha seleccionada
    }
  }, [watchDate]);

  // Calcular los horarios disponibles para la fecha seleccionada
  const calculateAvailableTimes = (date) => {
    const allTimes = [];
    const startHour = 10; // Hora de inicio (10:00 AM)
    const endHour = 18; // Hora de fin (6:00 PM)

    // Generar todos los horarios posibles entre las 10:00 y las 18:00
    for (let hour = startHour; hour < endHour; hour++) {
      allTimes.push({ hour, minutes: 0 }); // Hora en punto (ej. 10:00)
      allTimes.push({ hour, minutes: 30 }); // Media hora (ej. 10:30)
    }

    const now = new Date();
    const isToday = date === now.toISOString().split('T')[0]; // Verificar si la fecha seleccionada es hoy

    // Filtrar los horarios disponibles
    return allTimes.filter(({ hour, minutes }) => {
      if (isToday) {
        // Si es hoy, solo mostrar horarios futuros
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        // Si la hora es menor a la actual, descartar
        if (hour < currentHour) return false;

        // Si es la misma hora, descartar los minutos que ya pasaron
        if (hour === currentHour && minutes <= currentMinutes) return false;
      }

      // Si no es hoy, mostrar todos los horarios
      return true;
    }).map(({ hour, minutes }) => `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  };

  // Verificar si una fecha está completamente reservada
  const isDateFullyBooked = (date) => {
    const times = calculateAvailableTimes(date);
    return times.length === 0;
  };

  // Calcular la hora de fin basada en la hora de inicio y la duración
  const calculateEndTime = (startTime, duration) => {
    const [hour, minute] = startTime.split(":").map(Number);
    const durationMap = { "30 min": 30, "1 hora": 60, "2 horas": 120 };
    const endTime = new Date(2000, 0, 1, hour, minute);
    endTime.setMinutes(endTime.getMinutes() + durationMap[duration]);
    return `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  };

  // Registrar una cita
  const registerAppointment = async (data) => {
    const { date, time } = data;

    if (!selectedEntradaId) {
      setErrorMessage("Debes seleccionar una entrada pendiente.");
      return;
    }

    if (!tipoDuracion) {
      setErrorMessage("Debes seleccionar un tipo de duración.");
      return;
    }

    try {
      // Convertir el tipo de duración al formato de la base de datos
      const tipoDuracionBD = duracionMap[tipoDuracion];

      // Llamar a la API para crear la cita
      const response = await axios.post(`${import.meta.env.VITE_API_SERVER}/api/crear-cita`, {
        SDTGeneraCita: {
          CitaId: "", // Puedes generar un ID único si es necesario
          LocatarioId: locatarioId, // Usar el ID del locatario
          CitaFecha: date,
          CitaHoraInicio: time,
          CitaHoraFin: calculateEndTime(time, tipoDuracion), // Calcular la hora de fin
          CitaTipoDuracion: tipoDuracionBD, // Tipo de transporte seleccionado (en formato de BD)
          CitaUsuarioCheck: "false",
          FolioRegistro: "", // Usar el folio seleccionado
          CitaObserv: "Ninguna",
          EntradaId: selectedEntradaId, // ID de la entrada pendiente
        },
      });

      setErrorMessage('Cita registrada con éxito.');
      // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
    } catch (error) {
      console.error("Error al crear la cita:", error);
      setErrorMessage("Hubo un error al crear la cita. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-6 mt-3 shadow-xl border">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Solicitud de Cita para Ingreso de Mercancía
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(registerAppointment)}>
        {/* Selector de entradas pendientes */}
        <div>
          <label htmlFor="entradasPendientes" className="block text-sm font-semibold uppercase">
            Entrada Pendiente:
          </label>
          <select
            id="entradasPendientes"
            value={selectedEntradaId}
            onChange={(e) => setSelectedEntradaId(e.target.value)}
            className="block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm"
          >
            <option value="">Selecciona una entrada pendiente</option>
            {entradasPendientes.map((entrada) => (
              <option key={entrada.EntradaId} value={entrada.EntradaId}>
                {entrada.EntradaId} - {entrada.LocatarioNombre}
              </option>
            ))}
          </select>
          {!selectedEntradaId && <ErrorMessage>Debes seleccionar una entrada pendiente.</ErrorMessage>}
        </div>

        {/* Selector de tipo de duración (siempre visible) */}
        <div>
          <label htmlFor="tipoDuracion" className="block text-sm font-semibold uppercase">
            Tipo de Duración:
          </label>
          <select
            id="tipoDuracion"
            value={tipoDuracion}
            onChange={(e) => setTipoDuracion(e.target.value)}
            className="block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm"
          >
            <option value="">Selecciona un tipo de duración</option>
            <option value="30 min">30 minutos</option>
            <option value="1 hora">1 hora</option>
            <option value="2 horas">2 horas</option>
          </select>
          {!tipoDuracion && <ErrorMessage>Debes seleccionar un tipo de duración.</ErrorMessage>}
        </div>

        {/* Selector de fecha */}
        <div>
          <label htmlFor="date" className="block text-sm font-semibold uppercase">Fecha:</label>
          <input
            type="date"
            id="date"
            className={`block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm ${isDateFullyBooked(watchDate) ? 'bg-red-200' : ''}`}
            {...register('date', { required: "La fecha es obligatoria" })}
            min={new Date().toISOString().split("T")[0]}
          />
          {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
        </div>

        {/* Selector de hora */}
        <div>
          <label htmlFor="time" className="block text-sm font-semibold uppercase">Hora:</label>
          <select
            id="time"
            className="block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm"
            {...register('time', { required: "La hora es obligatoria" })}
          >
            <option value="">Selecciona una hora</option>
            {availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))
            ) : (
              <option value="" disabled>No hay horarios disponibles</option>
            )}
          </select>
          {errors.time && <ErrorMessage>{errors.time.message}</ErrorMessage>}
        </div>

        {/* Botón de envío */}
        <input
          type="submit"
          className={`w-full mt-3 p-3 text-white uppercase font-bold ${
            watchDate && watchTime && selectedEntradaId && tipoDuracion
              ? "bg-indigo-500 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          value='Agendar Cita'
          disabled={!watchDate || !watchTime || !selectedEntradaId || !tipoDuracion} // Deshabilitar si no hay fecha, hora, entrada o tipo de duración seleccionada
        />

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </form>
    </div>
  );
};

export default Appointment;