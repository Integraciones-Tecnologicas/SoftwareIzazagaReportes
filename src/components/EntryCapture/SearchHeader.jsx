import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFile, faEdit } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../store/store"; // Importamos el store
import RegisterProduct from "./RegisterProduct";
import { toast, ToastContainer } from "react-toastify";

const SearchHeader = ({ toggleModal }) => {
  const entries = useStore((state) => state.entries); // Obtenemos las entradas del store
  const [selectedEntry, setSelectedEntry] = useState(null); // Estado para la entrada seleccionada
  const [editModalOpen, setEditModalOpen] = useState(false); 
  const [update, setUpdate] = useState(false); 

  const [formData, setFormData] = useState({
    sku: "",
    description: "",
    cost: "",
    price: "",
    quantity: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Si estamos escribiendo en el campo SKU, verificar si existe en el store
    if (id === "sku") {
      const existingEntry = entries.find((entry) => entry.sku === value);

      if (existingEntry) {
        // Si el SKU existe, llenamos los demás campos automáticamente
        setFormData({
          sku: value,
          description: existingEntry.description,
          cost: existingEntry.cost,
          price: existingEntry.price,
        });
        setSelectedEntry(existingEntry);
        setUpdate(true);
        toast.info("Producto encontrado y datos llenados automáticamente");
      } else {
        // Limpiamos los campos si no se encuentra el SKU
        setFormData({
          sku: value,
          description: "",
          cost: "",
          price: "",
        });
        setSelectedEntry(null);
        setUpdate(false);
        toast.error("SKU no encontrado");
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const modifiedEntries = useStore((state) => state.modifiedEntries);
  const updateModifiedEntries = useStore((state) => state.updateModifiedEntries);

  const handleQuantityChange = (e) => {
    const { value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      quantity: value,
    }));
  };

  const handleAddQuantity = () => {
    if (formData.sku && formData.quantity) {
      updateModifiedEntries({ sku: formData.sku, quantity: formData.quantity });
      toast.success("Cantidad agregada correctamente.");
      setFormData((prevData) => ({
        ...prevData,
        quantity: "",
      }));
    } else {
      toast.error("Debes ingresar un SKU y una cantidad.");
    }
  };
  

  const openUpdateModal = () => {
    setEditModalOpen(true);
  };

  const closeUpdateModal = () => {
    setEditModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-9 gap-4 mb-6">
      <ToastContainer />
      <div className="md:col-span-4">
        <label className="block font-semibold text-gray-700 mb-2" htmlFor="sku">
          SKU {""}
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </label>
        <input
          id="sku"
          type="text"
          placeholder="Ejemplo: 12345"
          className="w-full border border-indigo-700 rounded-lg px-4 py-2"
          value={formData.sku}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="md:col-span-1">
        <button onClick={toggleModal} className="relative text-blue-600 hover:text-blue-800">
          <FontAwesomeIcon icon={faFile} size="2x" />
          <span className="absolute top-0 left-full px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Crear Nuevo
          </span>
        </button>
      </div>

      <div className="md:col-span-1">
        {update && (
          <button
            onClick={openUpdateModal}
            className="text-indigo-600 hover:text-indigo-700 flex items-center"
          >
            <FontAwesomeIcon icon={faEdit} size="2xl" />
          </button>
        )}
      </div>

      <div className="md:col-span-4">
        <label className="block font-semibold text-gray-700 mb-2" htmlFor="description">
          Descripción
        </label>
        <input
          id="description"
          type="text"
          readOnly
          placeholder="Ejemplo: Producto X"
          className="w-full border border-indigo-700 rounded-lg px-4 py-2"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block font-semibold text-gray-700 mb-2" htmlFor="cost">
          Costo
        </label>
        <input
          id="cost"
          type="text"
          readOnly
          min={0}
          placeholder="Ejemplo: 100"
          className="w-full border border-indigo-700 rounded-lg px-4 py-2"
          value={formData.cost}
          onChange={handleInputChange}
        />
      </div>
      <div className="md:col-span-2">
        <label className="block font-semibold text-gray-700 mb-2" htmlFor="price">
          Precio V
        </label>
        <input
          id="price"
          type="text"
          readOnly
          min={0}
          placeholder="Ejemplo: 150"
          className="w-full border border-indigo-700 rounded-lg px-4 py-2"
          value={formData.price}
          onChange={handleInputChange}
        />
      </div>

      <div className="md:col-span-4">
        <label className="block font-semibold text-gray-700 mb-2" htmlFor="quantity">
          Cantidad
        </label>
        <input
          id="quantity"
          type="number"
          min="0"
          placeholder="Ejemplo: 10"
          className="w-full border border-indigo-700 rounded-lg px-4 py-2"
          value={formData.quantity}
          onChange={handleQuantityChange}
        />
      </div>

      <div className="md:col-span-2 flex items-end">
        <button
          onClick={handleAddQuantity}
          className="bg-blue-600 text-white text-sm uppercase font-semibold px-2 py-2 rounded-lg hover:bg-blue-800"
        >
          Agregar Cantidad
        </button>
      </div>

      {/* Modal de Edición */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-200 rounded-xl shadow-lg p-8 w-full max-w-4xl relative overflow-y-auto max-h-screen">            
            <RegisterProduct 
              toggleModal={closeUpdateModal}
              initialData={selectedEntry} 
            />
            <button
              onClick={closeUpdateModal} 
              className="absolute text-2xl top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SearchHeader;
