import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import useStore from "../store/store";

const Appointment = () => {
  const {
    savedReports,
    appointments,
    addAppointment,
    isTimeAvailable,
    isFolioUsed,
    getReportsByCurrentUser,
    currentUser,
    completeReport,
    loadPendingReport,
  } = useStore();

  const [latestReport, setLatestReport] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [pendingReports, setPendingReports] = useState([]); // Lista de reportes pendientes
  const [selectedPendingReport, setSelectedPendingReport] = useState(""); // Reporte pendiente seleccionado

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const folio = latestReport ? latestReport.id : "";
  const duration = latestReport ? latestReport.selectedTime : "No definido";
  const selectedDuration = latestReport?.selectedTime || "30 min";

  // Obtener el último reporte del usuario actual y los reportes pendientes
  useEffect(() => {
    const userReports = getReportsByCurrentUser();
    if (userReports.length > 0) {
      setLatestReport(userReports[userReports.length - 1]);
      setPendingReports(userReports.filter((report) => report.status === "pendiente")); // Filtrar reportes pendientes
    } else {
      setLatestReport(null);
      setPendingReports([]);
    }
  }, [getReportsByCurrentUser, savedReports]);

  // Cargar un reporte pendiente seleccionado
  useEffect(() => {
    if (selectedPendingReport) {
      loadPendingReport(selectedPendingReport); // Cargar el reporte pendiente seleccionado
      const report = savedReports.find((r) => r.id === selectedPendingReport && r.status === "pendiente");
      if (report) {
        setLatestReport(report); // Establecer el reporte como el último
      }
    }
  }, [selectedPendingReport, savedReports, loadPendingReport]);

  // Calcular los horarios disponibles para la fecha seleccionada
  const calculateAvailableTimes = (date) => {
    const allTimes = [];
    const startHour = 10;
    const endHour = 18;
    const durationMap = { "30 min": 30, "1 hora": 60, "2 horas": 120 };

    for (let hour = startHour; hour < endHour; hour++) {
      allTimes.push({ hour, minutes: 0 });
      allTimes.push({ hour, minutes: 30 });
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    return allTimes.filter(({ hour, minutes }) => {
      if (date === now.toISOString().split('T')[0] && (hour < currentHour || (hour === currentHour && minutes <= currentMinutes))) {
        return false;
      }

      const startTime = new Date(2000, 0, 1, hour, minutes);
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + durationMap[selectedDuration]);

      return !appointments.some((appointment) => {
        if (appointment.userId !== currentUser.id || appointment.date !== date) return false;

        const appointmentStart = new Date(2000, 0, 1, ...appointment.time.split(":").map(Number));
        const appointmentEnd = new Date(appointmentStart);
        appointmentEnd.setMinutes(appointmentEnd.getMinutes() + durationMap[appointment.duration]);

        return (
          (startTime >= appointmentStart && startTime < appointmentEnd) ||
          (endTime > appointmentStart && endTime <= appointmentEnd) ||
          (startTime <= appointmentStart && endTime >= appointmentEnd)
        );
      });
    }).map(({ hour, minutes }) => `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  };

  // Verificar si una fecha está completamente reservada
  const isDateFullyBooked = (date) => {
    const availableTimes = calculateAvailableTimes(date);
    return availableTimes.length === 0;
  };

  // Registrar una cita
  const registerAppointment = (data) => {
    const { date, time } = data;

    if (!latestReport) {
      setErrorMessage("No hay un reporte guardado. Por favor, genera un reporte antes de agendar.");
      return;
    }

    if (!duration) {
      setErrorMessage("No se ha seleccionado una duración válida.");
      return;
    }

    if (isFolioUsed(folio)) {
      setErrorMessage("Este folio ya ha sido utilizado. Por favor, genera un nuevo reporte.");
      return;
    }

    if (!isTimeAvailable(date, time, duration)) {
      setErrorMessage("Este horario ya está reservado. Por favor, elige otro.");
      return;
    }

    setErrorMessage('Cita registrada con éxito.');
    addAppointment({ date, time, duration, folio });
    completeReport(folio); // Cambiar el estado del reporte a "completo"

    // Limpiar el campo de folio
    setLatestReport(null);
    reset();
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-6 mt-3 shadow-xl border">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Solicitud de Cita para Ingreso de Mercancía
      </h2>

      {/* Input para seleccionar reportes pendientes */}
      <div className="mb-6">
        <label htmlFor="pendingReports" className="block text-sm font-semibold uppercase">
          Reportes Pendientes:
        </label>
        <select
          id="pendingReports"
          value={selectedPendingReport}
          onChange={(e) => setSelectedPendingReport(e.target.value)}
          className="block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm"
        >
          <option value="">Selecciona un reporte pendiente</option>
          {pendingReports.map((report) => (
            <option key={report.id} value={report.id}>
              {report.id} - {report.selectedTime}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Historial de Citas Reservadas</h3>
        <ul className="mt-2 border rounded-lg p-3 bg-gray-50">
          {savedReports.length > 0 ? (
            savedReports.map((report) => {
              const appointment = appointments.find((app) => app.folio === report.id);

              return (
                <li key={report.id} className="p-2 border-b">
                  <strong>Folio:</strong> {report.id} <br />
                  <strong>Fecha:</strong> {appointment ? appointment.date : "No definida"} <br />
                  <strong>Hora:</strong> {appointment ? appointment.time : "No definida"} <br />
                  <strong>Duración:</strong> {report.selectedTime || "No definida"} <br />
                  <strong>Estado:</strong> {report.status || "No definido"}
                </li>
              );
            })
          ) : (
            <p>No hay reportes guardados.</p>
          )}
        </ul>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(registerAppointment)}>
        <div>
          <label htmlFor="date" className="block text-sm font-semibold uppercase">Fecha:</label>
          <input
            type="date"
            id="date"
            className={`block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm ${isDateFullyBooked(selectedDate) ? 'bg-red-200' : ''}`}
            {...register('date', { required: "La fecha es obligatoria" })}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
          {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-semibold uppercase">Hora:</label>
          <select
            id="time"
            className="block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm"
            {...register('time', { required: "La hora es obligatoria" })}
          >
            <option value="">Selecciona una hora</option>
            {calculateAvailableTimes(selectedDate).length > 0 ? (
              calculateAvailableTimes(selectedDate).map((time) => (
                <option key={time} value={time}>{time}</option>
              ))
            ) : (
              <option value="" disabled>No hay horarios disponibles</option>
            )}
          </select>
          {errors.time && <ErrorMessage>{errors.time.message}</ErrorMessage>}
        </div>

        <div>
          <label htmlFor="folio" className="block text-sm font-semibold uppercase">Folio de Registro:</label>
          <input
            type="text"
            id="folio"
            value={folio}
            readOnly
            className="block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-semibold uppercase">Duración:</label>
          <input
            type="text"
            id="duration"
            value={duration}
            readOnly
            className="block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <input
          type="submit"
          className={`w-full mt-3 p-3 text-white uppercase font-bold ${folio ? "bg-indigo-500 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
          value='Agendar Cita'
          disabled={!folio}
        />
      </form>
    </div>
  );
};

export default Appointment;