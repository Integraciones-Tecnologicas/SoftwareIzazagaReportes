import { create } from "zustand";

const useStore = create((set) => ({
  entries: [],
  modifiedEntries: [],
  savedReports: [], // Almacenar reportes con ID único
  selectedTime: null, // Almacenar la selección del tiempo

  addEntry: (entry) => {
    set((state) => {
      const existingEntryIndex = state.entries.findIndex((e) => e.sku === entry.sku);

      if (existingEntryIndex >= 0) {
        const updatedEntries = [...state.entries];
        updatedEntries[existingEntryIndex] = { ...updatedEntries[existingEntryIndex], ...entry };

        const updatedModifiedEntries = state.modifiedEntries.map((modifiedEntry) => {
          if (modifiedEntry.sku === entry.sku) {
            return {
              ...modifiedEntry,
              ...entry,
              quantity: modifiedEntry.quantity,
            };
          }
          return modifiedEntry;
        });

        return { entries: updatedEntries, modifiedEntries: updatedModifiedEntries };
      } else {
        // Agregar ID único al crear una nueva entrada
        const newEntry = {
          ...entry,
          id: `ID-${Date.now()}`, // ID único generado para cada producto
        };
        return { entries: [...state.entries, newEntry] };
      }
    });
  },

  updateModifiedEntries: (entry) => {
    set((state) => {
      const existingEntryIndex = state.entries.findIndex((e) => e.sku === entry.sku);
      if (existingEntryIndex >= 0) {
        const updatedModifiedEntries = [...state.modifiedEntries];
        const newEntry = {
          ...state.entries[existingEntryIndex],
          quantity: entry.quantity,
          id: `ID-${Date.now()}`, // Asignar un ID único
        };

        updatedModifiedEntries.push(newEntry);

        return { modifiedEntries: updatedModifiedEntries };
      } else {
        return { modifiedEntries: state.modifiedEntries };
      }
    });
  },

  removeModifiedEntryById: (id) =>
    set((state) => {
      const updatedModifiedEntries = state.modifiedEntries.filter((entry) => entry.id !== id);
      return { modifiedEntries: updatedModifiedEntries };
    }),

  setSelectedTime: (time) => set(() => ({ selectedTime: time })),

  saveReport: () =>
    set((state) => {
      if (state.modifiedEntries.length > 0) {
        const newReport = {
          id: `REP-${Date.now()}`, // ID único para el reporte
          products: [...state.modifiedEntries],
          selectedTime: state.selectedTime, // Guardar el tiempo seleccionado en el reporte
        };
        return {
          savedReports: [...state.savedReports, newReport],
          modifiedEntries: [], // Vaciar modifiedEntries
          selectedTime: null, // Resetear selección de tiempo
        };
      }
      return {};
    }),
}));

export default useStore;
