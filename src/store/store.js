import { create } from "zustand";

const useStore = create((set, get) => ({
  entries: [], //Productos 
  modifiedEntries: [], //Productos con cantidades
  savedReports: [], //Reportes con distintos productos con folio
  selectedTime: null,
  appointments: [], // Cada cita ahora incluirá el ID del usuario
  usedFolios: [], //Se marca usado para no volverlos a registrar
  tenants: [], // Almacenar locatarios
  currentUser: null, // Usuario actual (admin o locatario)

  // Función para agregar locatarios
  addTenant: (tenant) => {
    set((state) => {
      const existingIndex = state.tenants.findIndex((t) => t.nameTenant === tenant.nameTenant);
  
      if (existingIndex !== -1) {
        // Si ya existe, actualizar los datos sin cambiar el ID
        const updatedTenants = [...state.tenants];
        updatedTenants[existingIndex] = { ...updatedTenants[existingIndex], ...tenant };
  
        return { tenants: updatedTenants };
      } else {
        // Si no existe, agregarlo como nuevo
        return {
          tenants: [...state.tenants, { ...tenant, id: `TENANT-${Date.now()}` }]
        };
      }
    });
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

  // Función para agregar una entrada
  addEntry: (entry) => {
    set((state) => {
      const existingEntryIndex = state.entries.findIndex((e) => e.sku === entry.sku);

      if (existingEntryIndex >= 0) {
        const updatedEntries = [...state.entries];
        updatedEntries[existingEntryIndex] = { ...updatedEntries[existingEntryIndex], ...entry };

        const updatedModifiedEntries = state.modifiedEntries.map((modifiedEntry) => {
          if (modifiedEntry.sku === entry.sku) {
            return { 
              ...modifiedEntry, ...entry, 
              quantity: modifiedEntry.quantity 
            };
          }
          return modifiedEntry;
        });

        return { entries: updatedEntries, modifiedEntries: updatedModifiedEntries };
      } else {
        const newEntry = { 
          ...entry, 
          id: `ID-${Date.now()}`,
          createdBy: state.currentUser, // Guardar quién creó el producto
        };
        
        return { entries: [...state.entries, newEntry] };
      }
    });
  },

  // Función para actualizar entradas modificadas
  updateModifiedEntries: (entry) => {
    set((state) => {
      const existingEntryIndex = state.entries.findIndex((e) => e.sku === entry.sku);
      if (existingEntryIndex >= 0) {
        const updatedModifiedEntries = [...state.modifiedEntries];
        const newEntry = { 
          ...state.entries[existingEntryIndex],
          quantity: entry.quantity, 
          id: `ID-${Date.now()}`,
          createdBy: state.currentUser, // Guardar quién modificó el producto
        };

        updatedModifiedEntries.push(newEntry);
        return { modifiedEntries: updatedModifiedEntries };
      } else {
        return { modifiedEntries: state.modifiedEntries };
      }
    });
  },

  // Función para eliminar una entrada modificada por ID
  removeModifiedEntryById: (id) => set((state) => ({
    modifiedEntries: state.modifiedEntries.filter((entry) => entry.id !== id),
  })),

  // Función para seleccionar el tiempo
  setSelectedTime: (time) => set(() => ({ selectedTime: time })),

  // Función para guardar un reporte
  saveReport: () => set((state) => {
    if (state.modifiedEntries.length > 0) {
      const newReport = {
        id: `REP-${Date.now()}`,
        products: [...state.modifiedEntries],
        selectedTime: state.selectedTime,
        createdBy: state.currentUser, // Guardar quién creó el reporte
      };
      return {
        savedReports: [...state.savedReports, newReport],
        modifiedEntries: [],
        selectedTime: null,
      };
    }
    return {};
  }),

  // Función para verificar si un folio está usado
  isFolioUsed: (folio) => {
    return get().usedFolios.includes(folio);
  },

  // Función para agregar una cita
  addAppointment: (appointment) => {
    const { currentUser } = get();
    set((state) => ({
      appointments: [...state.appointments, { ...appointment, userId: currentUser.id }],
      usedFolios: [...state.usedFolios, appointment.folio],
    }));
  },

  // Función para verificar si un tiempo está disponible para el usuario actual
  isTimeAvailable: (date, time, duration) => {
    const { currentUser, appointments } = get();
    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime);

    if (duration === "30 min") endTime.setMinutes(endTime.getMinutes() + 30);
    if (duration === "1 hora") endTime.setHours(endTime.getHours() + 1);
    if (duration === "2 horas") endTime.setHours(endTime.getHours() + 2);

    if (startTime.getHours() < 10 || startTime.getHours() >= 18) {
      return false;
    }

    // Solo verificamos las citas del usuario actual
    return !appointments.some((appointment) => {
      if (appointment.userId !== currentUser.id || appointment.date !== date) return false;

      const appointmentStart = new Date(`${appointment.date}T${appointment.time}`);
      const appointmentEnd = new Date(appointmentStart);

      if (appointment.duration === "30 min") appointmentEnd.setMinutes(appointmentEnd.getMinutes() + 30);
      if (appointment.duration === "1 hora") appointmentEnd.setHours(appointmentEnd.getHours() + 1);
      if (appointment.duration === "2 horas") appointmentEnd.setHours(appointmentEnd.getHours() + 2);

      return (
        (startTime >= appointmentStart && startTime < appointmentEnd) ||
        (endTime > appointmentStart && endTime <= appointmentEnd) ||
        (startTime <= appointmentStart && endTime >= appointmentEnd)
      );
    });
  },

  // Función para obtener solo las entradas creadas por el usuario actual
  getEntriesByCurrentUser: () => {
    const { entries, currentUser } = get();
    return entries.filter((entry) => entry.createdBy?.id === currentUser?.id);
  },

  // Función para obtener solo los reportes creados por el usuario actual
  getReportsByCurrentUser: () => {
    const { savedReports, currentUser } = get();
    return savedReports.filter((report) => report.createdBy?.id === currentUser?.id);
  },
}));

export default useStore;