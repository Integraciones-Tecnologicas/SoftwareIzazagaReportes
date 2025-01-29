import { create } from "zustand";

const useStore = create((set, get) => ({
  entries: [],
  modifiedEntries: [],
  savedReports: [], // Almacenar reportes con ID único
  selectedTime: null, // Almacenar la selección del tiempo
  appointments: [], // Almacenar citas reservadas
  usedFolios: [], // Lista de folios utilizados
  

  addEntry: (entry) => {
    set((state) => {
      const existingEntry = state.entries.find((e) => e.sku === entry.sku);
  
      if (existingEntry) {
        toast.error("El SKU ya existe. Ingresa un SKU diferente.");
        return {}; // No realiza cambios en el estado
      }
  
      const newEntry = { ...entry, id: `ID-${Date.now()}` };
      return { entries: [...state.entries, newEntry] };
    });
  },

  updateModifiedEntries: (entry) => {
    set((state) => {
      const existingEntryIndex = state.entries.findIndex((e) => e.sku === entry.sku);
      if (existingEntryIndex >= 0) {
        const updatedModifiedEntries = [...state.modifiedEntries];
        const newEntry = { ...state.entries[existingEntryIndex], quantity: entry.quantity, id: `ID-${Date.now()}` };

        updatedModifiedEntries.push(newEntry);
        return { modifiedEntries: updatedModifiedEntries };
      } else {
        return { modifiedEntries: state.modifiedEntries };
      }
    });
  },

  removeModifiedEntryById: (id) => set((state) => ({
    modifiedEntries: state.modifiedEntries.filter((entry) => entry.id !== id),
  })),

  setSelectedTime: (time) => set(() => ({ selectedTime: time })),

  saveReport: () => set((state) => {
    if (state.modifiedEntries.length > 0) {
      const newReport = {
        id: `REP-${Date.now()}`,
        products: [...state.modifiedEntries],
        selectedTime: state.selectedTime,
      };
      return {
        savedReports: [...state.savedReports, newReport],
        modifiedEntries: [],
        selectedTime: null,
      };
    }
    return {};
  }),

  addAppointment: (appointment) => {
    set((state) => ({
      appointments: [...state.appointments, appointment],
      usedFolios: [...state.usedFolios, appointment.folio], // Marcar el folio como usado
    }));
  },

  isFolioUsed: (folio) => {
    return get().usedFolios.includes(folio);
  },

  isTimeAvailable: (date, time, duration) => {
    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime);

    if (duration === "30 min") endTime.setMinutes(endTime.getMinutes() + 30);
    if (duration === "1 hora") endTime.setHours(endTime.getHours() + 1);
    if (duration === "2 horas") endTime.setHours(endTime.getHours() + 2);

    if (startTime.getHours() < 10 || startTime.getHours() >= 18) {
      return false;
    }

    return !get().appointments.some((appointment) => {
      const appointmentStart = new Date(`${appointment.date}T${appointment.time}`);
      const appointmentEnd = new Date(appointmentStart);

      if (appointment.duration === "30 min") appointmentEnd.setMinutes(appointmentEnd.getMinutes() + 30);
      if (appointment.duration === "1 hora") appointmentEnd.setHours(appointmentEnd.getHours() + 1);
      if (appointment.duration === "2 horas") appointmentEnd.setHours(appointmentEnd.getHours() + 2);

      return (
        (startTime >= appointmentStart && startTime < appointmentEnd) ||
        (endTime > appointmentStart && endTime <= appointmentEnd)
      );
    });
  },
}));

export default useStore;