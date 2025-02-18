import { useState, useEffect } from "react";
import axios from "axios";
import RegisterProduct from "../components/EntryCapture/RegisterProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import useStore from "../store/store";
import { ToastContainer, toast } from "react-toastify";

const CatalogPage = () => {
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [isModalOpen, setModalOpen] = useState(false);
  const currentUser = useStore((state) => state.currentUser);
 
  // Función para obtener los productos
  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/productos", {
        params: { LocatarioId: 0 },
      });
      
      // Verificar que la respuesta contiene el arreglo 'SDTProds'
      if (response.data.SDTProds && Array.isArray(response.data.SDTProds)) {
        setProductos(response.data.SDTProds); // Usar el arreglo de productos
      } else {
        throw new Error("No se encontraron productos.");
      }
    } catch (error) {
      setError(error.message); // Manejar errores
    } finally {
      setLoading(false); // Finalizar la carga
    }
  };
  
  const handleEliminarProducto = async (sku) => {
    try {
      const Locatarioid = 1; // Valor fijo por ahora
  
      // Confirmación antes de eliminar
      const confirmacion = window.confirm(`¿Seguro que deseas eliminar el producto con SKU: ${sku}?`);
      if (!confirmacion) return;
  
      const response = await axios.get(
        `http://localhost:5000/api/eliminar-producto?Locatarioid=${Locatarioid}&Prodssku=${sku}`
      );
  
      toast.success("Producto eliminado correctamente");
      
      // Actualizar la lista de productos
      fetchProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast("Error al eliminar el producto");
    }
  };
  

  // Cargar los productos cuando el componente se monta
  useEffect(() => {
    fetchProductos();
  }, []);

  if (loading) {
    return <p>Cargando productos...</p>; // Mostrar un mensaje de carga
  }

  if (error) {
    return <p>Error: {error}</p>; // Mostrar un mensaje de error
  }

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div className="max-w-6xl mx-auto mt-5 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Productos Registrados</h2>
      <ToastContainer />
      <div className="md:col-span-2 py-2">
        <button onClick={toggleModal} className="text-blue-600 hover:text-blue-800">
          <FontAwesomeIcon icon={faFile} size="3x" />
        </button>
      </div>

      {productos.length === 0 ? (
        <p className="text-center text-gray-500">No hay productos registrados.</p>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full bg-white shadow-lg table-auto border-collapse">
            <thead className="bg-gray-200 text-gray-600 tracking-wider">
              <tr>
                <th className="px-4 py-3 border-b">Descripción</th>
                <th className="px-4 py-3 border-b">SKU</th>
                <th className="px-4 py-3 border-b">Costo</th>
                <th className="px-4 py-3 border-b">Precio</th>
                <th className="px-4 py-3 border-b">Línea</th>
                <th className="px-4 py-3 border-b">Subfamilia</th>
                <th className="px-4 py-3 border-b">Piratería</th>
                <th className="px-4 py-3 border-b">Imagen</th>
                <th className="px-4 py-3 border-b">Observaciones</th>
                {currentUser.role === "admin" ? (
                <th className="px-4 py-3 border-b">Locatario</th>
                ) : ("")}
                <th className="px-4 py-3 border-b">Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-100">
                  <td className="px-4 py-3 border-b">{producto.ProdsDescrip}</td>
                  <td className="px-4 py-3 border-b text-center">{producto.ProdsSKU || "N/A"}</td>
                  <td className="px-4 py-3 border-b text-center">{producto.ProdsCosto}</td>
                  <td className="px-4 py-3 border-b text-center">{producto.ProdsPrecio1}</td>
                  <td className="px-4 py-3 border-b">{producto.ProdsLinea}</td>
                  <td className="px-4 py-3 border-b">{producto.ProdsFamilia}</td>
                  <td className="px-4 py-3 border-b">{producto.ProdsChek1 ? "Sí" : "No"}</td>
                  <td className="px-4 py-3 border-b">{producto.imagen}</td>
                  <td className="px-4 py-3 border-b">{producto.ProdsObserv || "N/A"}</td>
                  {currentUser.role === "admin" ? (
                    <td className="px-4 py-3 border-b">{producto.LocatarioId} </td>
                  ) : ("")}
                  <td className="px-4 py-3 border-b">
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                      onClick={() => handleEliminarProducto(producto.ProdsSKU)}
                    >Eliminar </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-200 rounded-xl shadow-lg p-8 w-full max-w-4xl relative overflow-y-auto max-h-screen">
            <RegisterProduct toggleModal={toggleModal} onProductCreated={fetchProductos} />
            <button
              onClick={toggleModal}
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

export default CatalogPage;
