import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFile, faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import RegisterProduct from "./RegisterProduct";
import useStore from "../../store/store";

const SearchHeader = ({ toggleModal, entradaId, setEntradaId, fetchEntrada }) => {
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
  const [searchResults, setSearchResults] = useState([]); // Estado para almacenar los resultados de búsqueda
  const [showDropdown, setShowDropdown] = useState(false); // Estado para controlar el desplegable

  const descriptionRef = useRef(null);

  // Función para buscar productos por SKU
  const buscarProducto = async (sku) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/buscar-producto`, {
        params: { Locatarioid: 2, Prodssku: sku },
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

  // Función para buscar productos por descripción
  const buscarProductoPorDescripcion = async (descripcion) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/buscar-productos`, {
        params: { Locatarioid: 0, Prodsdescrip: descripcion },
      });

      // Verificar si la respuesta contiene productos
      if (response.data && response.data.SDTProds && response.data.SDTProds.length > 0) {
        setSearchResults(response.data.SDTProds); // Almacenar los resultados de búsqueda
        setShowDropdown(true); // Mostrar el desplegable
      } else {
        setSearchResults([]); // Limpiar los resultados si no hay coincidencias
        setShowDropdown(false); // Ocultar el desplegable
        toast.info("No se encontraron productos con esa descripción.");
      }
    } catch (error) {
      console.error("Error al buscar producto por descripción:", error);
      toast.error("Hubo un error al buscar el producto por descripción.");
    }
  };

  // Función para manejar la selección de un producto del desplegable
  const handleSelectProduct = (producto) => {
    setFormData({
      sku: producto.ProdsSKU,
      description: producto.ProdsDescrip,
      cost: producto.ProdsCosto,
      price: producto.ProdsPrecio1,
      quantity: formData.quantity, // Mantener la cantidad actual
    });
    setSelectedEntry(producto);
    setUpdate(true);
    setShowDropdown(false); // Ocultar el desplegable después de seleccionar
    toast.info("Producto seleccionado y datos llenados automáticamente");
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "sku") {
      if (value.length > 2) {
        buscarProducto(value);
      } else if (value === "") {
        // Limpiar todos los campos excepto la cantidad si el SKU está vacío
        setFormData({
          sku: "",
          description: "",
          cost: "",
          price: "",
          quantity: formData.quantity, // Mantener la cantidad actual
        });
        setSelectedEntry(null);
        setUpdate(false);
      }
    } else if (id === "description") {
      if (value.length > 1) {
        buscarProductoPorDescripcion(value);
      } else if (value === "") {
        // Limpiar todos los campos excepto la cantidad si la descripción está vacía
        setFormData({
          sku: "",
          description: "",
          cost: "",
          price: "",
          quantity: formData.quantity, // Mantener la cantidad actual
        });
        setSelectedEntry(null);
        setUpdate(false);
        setSearchResults([]); // Limpiar los resultados de búsqueda
        setShowDropdown(false); // Ocultar el desplegable
      }
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

  // Agregar cantidad
  const handleAddQuantity = async () => {
    if (formData.sku && formData.quantity) {
      try {
        let entradaIdToUse = entradaId;
  
        // Si no hay un EntradaId, crea una nueva entrada
        if (!entradaIdToUse) {
          const entradaResponse = await axios.post(`${import.meta.env.VITE_API_SERVER}/api/crear-entrada`, {
            SDTEntrada: {
              LocatarioId: "2", // Asegúrate de que este valor sea correcto
              LocatarioNombre: "Juanpa", // Nombre del locatario (puede venir del estado global)
              EntradaFechaCap: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
              EntradaHoraCita: new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds(), // Hora seleccionada por el usuario
              EntradaTipoDuracion: "", // Tipo de duración (puedes ajustar esto)
              EntradaObserv: "Ninguna", // Observaciones (opcional)
            },
          });
  
          entradaIdToUse = entradaResponse.data.EntradaId; // Guarda el EntradaId generado
          setEntradaId(entradaIdToUse); // Actualiza el estado
        }
  
        // Agrega la parte de entrada
        const partResponse = await axios.post(`${import.meta.env.VITE_API_SERVER}/api/crear-part-entrada`, {
          EntradaId: entradaIdToUse,
          PartEntProdId: selectedEntry?.ProdId, // Usar el ID del producto (ProdId) en lugar del SKU
          PartEntCant: formData.quantity, // Cantidad ingresada
          PartEntCheck: "false", // Puedes ajustar esto según tu lógica
          PartEntObserv: "Ninguna", // Observaciones (opcional)
        });
  
        console.log("Parte de entrada creada:", partResponse.data);
  
        // Actualizar las partidas después de agregar una nueva
        fetchEntrada(entradaIdToUse);
  
        // Crear un objeto de entrada modificada
        const newEntry = {
          id: `ID-${Date.now()}`, // Generar un ID único
          sku: formData.sku,
          description: formData.description,
          cost: formData.cost,
          price: formData.price,
          quantity: formData.quantity,
          line: selectedEntry?.ProdsLinea || "N/A",
          subfamily: selectedEntry?.ProdsFamilia || "N/A",
          piracy: Boolean(selectedEntry?.ProdsChek1),
          observations: selectedEntry?.ProdsObserv || "N/A",
        };
  
        // Actualizar el estado global modifiedEntries
        useStore.getState().updateModifiedEntries(newEntry);
  
        toast.success("Cantidad agregada correctamente.");
  
        // Limpiar el formulario
        setFormData({
          sku: "",
          description: "",
          cost: "",
          price: "",
          quantity: "",
        });
  
        // Enfocar el campo de descripción
        if (descriptionRef.current) {
          descriptionRef.current.focus();
        }
  
      } catch (error) {
        console.error("Error al agregar cantidad:", error);
        toast.error("Hubo un error al agregar la cantidad.");
      }
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

      <div className="flex">
        {/* Botón Crear Nuevo */}
        <div className="col-span-1 px-4">
          <button title="Crear Producto" onClick={toggleModal} className="relative text-blue-600 hover:text-blue-800">
            <FontAwesomeIcon icon={faFile} size="2x" />
            <span className="absolute top-0 left-full px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Crear Nuevo
            </span>
          </button>
        </div>

        {/* Botón Editar */}
        <div className="col-span-1 px-4">
          {update && (
            <button
              title="Editar Producto"
              onClick={openUpdateModal}
              className="text-indigo-600 hover:text-indigo-700 flex items-center"
            >
              <FontAwesomeIcon icon={faEdit} size="2xl" />
            </button>
          )}
        </div>
      </div>
      
      {/* Campo Descripción */}
      <div className="md:col-span-4 relative">
        <label className="block font-semibold text-gray-700 mb-2" htmlFor="description">
          Descripción <FontAwesomeIcon icon={faMagnifyingGlass} />
        </label>
        <input
          id="description"
          type="text"
          placeholder="Ejemplo: Producto X"
          className="w-full border border-indigo-700 rounded-lg px-4 py-2"
          value={formData.description}
          onChange={handleInputChange}
          ref={descriptionRef}
        />
        {/* Desplegable de resultados de búsqueda */}
        {showDropdown && searchResults.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
            {searchResults.map((producto, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectProduct(producto)}
              >
                {producto.ProdsDescrip} (SKU: {producto.ProdsSKU})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/*Campo Costo */}
      <div className="md:col-span-2">
        <label className="block font-semibold text-gray-700 mb-2" htmlFor="price">
          Costo
        </label>
        <input
          id="price"
          type="text"
          readOnly
          min={0}
          placeholder="Ejemplo: 150"
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
      <div className="md:col-span-4 py-2">
        <span className="text-gray-700 font-bold">(Favor de Capturar caja por caja)</span>
        <label className="py-2 block font-semibold text-gray-700 mb-2" htmlFor="quantity">
          Cantidad por Caja
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