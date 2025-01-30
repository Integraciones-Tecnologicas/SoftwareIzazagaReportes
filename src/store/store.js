import { create } from "zustand";

const useStore = create((set, get) => ({
  entries: [],
  modifiedEntries: [],
  savedReports: [],
  selectedTime: null,
  appointments: [],
  usedFolios: [],
  tenants: [], // Almacenar locatarios
  currentUser: null, // Usuario actual (admin o locatario)

  // Función para agregar locatarios
  addTenant: (tenant) => {
    set((state) => ({
      tenants: [...state.tenants, { ...tenant, id: `TENANT-${Date.now()}` }],
    }));
  },

  // Función para iniciar sesión (admin o locatario)
  login: (email, password) => {
    const { tenants } = get();
    const user = tenants.find((tenant) => tenant.email === email && tenant.password === password);

    if (user) {
      set({ currentUser: user }); // Autenticar al locatario
      return true;
    } else if (email === "admin" && password === "123456") {
      set({ currentUser: { name: "Admin", role: "admin" } }); // Autenticar al admin
      return true;
    } else {
      return false; // Credenciales incorrectas
    }
  },

  // Función para cerrar sesión
  logout: () => {
    set({ currentUser: null });
  },

  addEntry: (entry) => {
    set((state) => {
      const existingEntryIndex = state.entries.findIndex((e) => e.sku === entry.sku);

      if (existingEntryIndex >= 0) {
        const updatedEntries = [...state.entries];
        updatedEntries[existingEntryIndex] = { ...updatedEntries[existingEntryIndex], ...entry };

        const updatedModifiedEntries = state.modifiedEntries.map((modifiedEntry) => {
          if (modifiedEntry.sku === entry.sku) {
            return { ...modifiedEntry, ...entry, quantity: modifiedEntry.quantity };
          }
          return modifiedEntry;
        });

        return { entries: updatedEntries, modifiedEntries: updatedModifiedEntries };
      } else {
        const newEntry = { ...entry, id: `ID-${Date.now()}` };
        return { entries: [...state.entries, newEntry] };
      }
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
      usedFolios: [...state.usedFolios, appointment.folio],
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
