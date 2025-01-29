import { useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import useStore from "../store/store";

const Appointment = () => {
    const savedReports = useStore((state) => state.savedReports);
    const latestReport = savedReports[savedReports.length - 1];

    const folio = latestReport ? latestReport.id : "Sin Registro...";
    const duration = latestReport ? latestReport.selectedTime : "No definido"; // Recuperar duración

    const addAppointment = useStore((state) => state.addAppointment);
    const isTimeAvailable = useStore((state) => state.isTimeAvailable);
  
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const getAvailableTimes = (selectedDate, selectedDuration) => {
        const allTimes = [];
        const startHour = 10;
        const endHour = 18;
        const durationMap = { "30 min": 30, "1 hora": 60, "2 horas": 120 };
    
        // Generar todos los horarios en intervalos de 30 minutos
        for (let hour = startHour; hour < endHour; hour++) {
            allTimes.push({ hour, minutes: 0 });
            allTimes.push({ hour, minutes: 30 });
        }
    
        const appointments = useStore.getState().appointments;
    
        return allTimes.filter(({ hour, minutes }) => {
            const startTime = new Date(2000, 0, 1, hour, minutes);
            const endTime = new Date(startTime);
            endTime.setMinutes(endTime.getMinutes() + durationMap[selectedDuration]);
    
            return !appointments.some((appointment) => {
                if (appointment.date !== selectedDate) return false;
    
                const appointmentStart = new Date(2000, 0, 1, ...appointment.time.split(":").map(Number));
                const appointmentEnd = new Date(appointmentStart);
                appointmentEnd.setMinutes(appointmentEnd.getMinutes() + durationMap[appointment.duration]);
    
                // Comprobar solapamiento
                return (
                    (startTime >= appointmentStart && startTime < appointmentEnd) || 
                    (endTime > appointmentStart && endTime <= appointmentEnd) || 
                    (startTime <= appointmentStart && endTime >= appointmentEnd)
                );
            });
        }).map(({ hour, minutes }) => `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    };
    
        
    const [selectedDate, setSelectedDate] = useState("");
    const selectedDuration = latestReport?.selectedTime || "30 min"; // Duración por defecto
    const availableTimes = getAvailableTimes(selectedDate, selectedDuration); // Pasar ambos valores


    const [errorMessage, setErrorMessage] = useState(null)
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

        const [hours, minutes] = time.split(":").map(Number);

        if (hours < 10 || hours >= 18) {
            setErrorMessage("Las citas solo pueden agendarse entre las 10:00 AM y las 6:00 PM.");
            return;
        }

        if (!isTimeAvailable(date, time, duration)) {
            setErrorMessage("Este horario ya está reservado. Por favor, elige otro.");
            return;
        }

        setErrorMessage('Cita registrada con éxito.'); // Si todo va bien, eliminamos el mensaje de error
        addAppointment({ date, time, duration, folio });
        reset();

        // alert("Cita registrada con éxito.");
    };

    return (
        
        <div className="max-w-md mx-auto bg-white rounded-lg p-6 mt-3 shadow-xl border">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Solicitud de Cita para Ingreso de Mercancía
            </h2>
           
            <div className="mt-6">
                <h3 className="text-xl font-semibold">Historial de Citas Reservadas</h3>
                <ul className="mt-2 border rounded-lg p-3 bg-gray-50">
                    {savedReports.length > 0 ? (
                        savedReports.map((report) => {
                            const appointment = useStore.getState().appointments.find(
                                (app) => app.folio === report.id
                            );

                            return (
                                <li key={report.id} className="p-2 border-b">
                                    <strong>Folio:</strong> {report.id} <br />
                                    <strong>Fecha:</strong> {appointment ? appointment.date : "No definida"} <br />
                                    <strong>Hora:</strong> {appointment ? appointment.time : "No definida"} <br />
                                    <strong>Duración:</strong> {report.selectedTime || "No definida"}
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
                        className="block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm"
                        {...register('date', { required: "La fecha es obligatoria" })}
                        onChange={(e) => setSelectedDate(e.target.value)}
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
                    className="w-full bg-indigo-500 mt-3 p-3 text-white uppercase font-bold hover:bg-indigo-700"
                    value='Agendar Cita'
                />
            </form>
        </div>
    );
};

export default Appointment;