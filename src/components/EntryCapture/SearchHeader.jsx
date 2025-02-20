import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFile, faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import RegisterProduct from "./RegisterProduct";

const SearchHeader = ({ toggleModal }) => {
  const [formData, setFormData] = useState({
    sku: "",
    description: "",
    cost: "",
    price: "",
    quantity: "",
  });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  // Función para buscar productos por SKU
  const buscarProducto = async (sku) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/buscar-producto`, {
        params: { Locatarioid: 1, Prodssku: sku },
      });
  
      // Verificar si la respuesta contiene productos
      if (response.data && response.data.SDTProds && response.data.SDTProds.length > 0) {
        // Buscar el producto que coincida con el SKU
        const productoEncontrado = response.data.SDTProds.find(
          (producto) => producto.ProdsSKU === sku
        );
  
        if (productoEncontrado) {
          // Si se encuentra el producto, llenar los campos del formulario
          setFormData({
            sku: productoEncontrado.ProdsSKU,
            description: productoEncontrado.ProdsDescrip,
            cost: productoEncontrado.ProdsCosto,
            price: productoEncontrado.ProdsPrecio1,
            quantity: formData.quantity, // Mantener la cantidad actual
          });
          setSelectedEntry(productoEncontrado);
          setUpdate(true);
          toast.info("Producto encontrado y datos llenados automáticamente");
        } else {
          // Si no se encuentra el SKU, limpiar los campos y mostrar un mensaje de error
          setFormData({
            sku: sku,
            description: "",
            cost: "",
            price: "",
            quantity: formData.quantity,
          });
          setSelectedEntry(null);
          setUpdate(false);
          toast.error("SKU no encontrado o no existe");
        }
      } else {
        // Si no hay productos en la respuesta, limpiar los campos y mostrar un mensaje de error
        setFormData({
          sku: sku,
          description: "",
          cost: "",
          price: "",
          quantity: formData.quantity,
        });
        setSelectedEntry(null);
        setUpdate(false);
        toast.error("No se encontraron productos");
      }
    } catch (error) {
      console.error("Error al buscar producto:", error);
      toast.error("Hubo un error al buscar el producto.");
    }
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "sku" && value.length > 2) {
      // Buscar solo si el SKU tiene más de 2 caracteres
      buscarProducto(value);
    }
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Manejar cambios en la cantidad
  const handleQuantityChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      quantity: value,
    }));
  };

  // Agregar cantidad (aquí podrías hacer una llamada a la API para actualizar la cantidad)
  const handleAddQuantity = () => {
    if (formData.sku && formData.quantity) {
      toast.success("Cantidad agregada correctamente.");
      setFormData((prevData) => ({
        ...prevData,
        quantity: "",
      }));
    } else {
      toast.error("Debes ingresar un SKU y una cantidad.");
    }
  };

  // Abrir modal de edición
  const openUpdateModal = () => {
    setEditModalOpen(true);
  };

  // Cerrar modal de edición
  const closeUpdateModal = () => {
    setEditModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-9 gap-4 mb-6">
      <ToastContainer />
      {/* Campo SKU */}
      <div className="md:col-span-4">
        <label className="block font-semibold text-gray-700 mb-2" htmlFor="sku">
          SKU <FontAwesomeIcon icon={faMagnifyingGlass} />
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

      {/* Botón Crear Nuevo */}
      <div className="md:col-span-1">
        <button onClick={toggleModal} className="relative text-blue-600 hover:text-blue-800">
          <FontAwesomeIcon icon={faFile} size="2x" />
          <span className="absolute top-0 left-full px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Crear Nuevo
          </span>
        </button>
      </div>

      {/* Botón Editar */}
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

      {/* Campo Descripción */}
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

      {/* Campo Costo */}
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

      {/* Campo Precio V */}
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

      {/* Campo Cantidad */}
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
          value={formData.quantity ?? ""}
          onChange={handleQuantityChange}
        />
      </div>

      {/* Botón Agregar Cantidad */}
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
              initialData={{
                ProdId: selectedEntry?.ProdId, // Asegúrate de incluir ProdId
                sku: selectedEntry?.ProdsSKU,
                description: selectedEntry?.ProdsDescrip,
                cost: selectedEntry?.ProdsCosto,
                price: selectedEntry?.ProdsPrecio1,
                line: selectedEntry?.ProdsLinea,
                subfamily: selectedEntry?.ProdsFamilia,
                piracy: Boolean(selectedEntry?.ProdsChek1),
                observations: selectedEntry?.ProdsObserv,
              }}
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