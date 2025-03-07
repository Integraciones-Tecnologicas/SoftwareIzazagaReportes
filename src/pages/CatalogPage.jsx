import { useState, useEffect } from "react";
import axios from "axios";
import RegisterProduct from "../components/EntryCapture/RegisterProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import useStore from "../store/store";
import { ToastContainer, toast } from "react-toastify";
import { faEdit, faMagnifyingGlass, faTrash } from "@fortawesome/free-solid-svg-icons";

const CatalogPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProductImages, setCurrentProductImages] = useState([]);
  const currentUser = useStore((state) => state.currentUser); // Obtén el usuario actual del store
  const locatarioId = currentUser?.locatarioId; // Obtén el LocatarioId del usuario actual

  // Función para obtener todos los productos
  const fetchProductos = async () => {
    try {
      // Si el usuario es admin, LocatarioId será 0
      if (locatarioId === undefined) {
        throw new Error("No se ha iniciado sesión o no se ha obtenido el LocatarioId.");
      }

      const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/productos`, {
        params: { LocatarioId: locatarioId }, // Usa el LocatarioId del usuario actual
      });

      if (response.data.SDTProds && Array.isArray(response.data.SDTProds)) {
        // Obtener las imágenes de cada producto
        const productosConImagenes = await Promise.all(
          response.data.SDTProds.map(async (producto) => {
            const imagenesResponse = await axios.get(
              `${import.meta.env.VITE_API_SERVER}/api/imagenes-producto/${producto.ProdId}`
            );
            return {
              ...producto,
              imagenes: imagenesResponse.data, // Agregar las imágenes al objeto del producto
            };
          })
        );
        setProductos(productosConImagenes);
      } else {
        throw new Error("No se encontraron productos.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar productos por descripción
  const buscarProductosPorDescripcion = async (descripcion) => {
    try {
      // Si el usuario es admin, LocatarioId será 0
      if (locatarioId === undefined) {
        throw new Error("No se ha iniciado sesión o no se ha obtenido el LocatarioId.");
      }

      const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/buscar-productos`, {
        params: { Locatarioid: locatarioId, Prodsdescrip: descripcion }, // Usa el LocatarioId del usuario actual
      });

      if (response.data && response.data.SDTProds && response.data.SDTProds.length > 0) {
        // Obtener las imágenes de cada producto
        const productosConImagenes = await Promise.all(
          response.data.SDTProds.map(async (producto) => {
            const imagenesResponse = await axios.get(
              `${import.meta.env.VITE_API_SERVER}/api/imagenes-producto/${producto.ProdId}`
            );
            return {
              ...producto,
              imagenes: imagenesResponse.data, // Agregar las imágenes al objeto del producto
            };
          })
        );
        setProductos(productosConImagenes);
      } else {
        setProductos([]);
        toast.info("No se encontraron productos con esa descripción.");
      }
    } catch (error) {
      console.error("Error al buscar productos por descripción:", error);
      toast.error("Hubo un error al buscar productos.");
    }
  };

  // Función para manejar la eliminación de un producto
  const handleEliminarProducto = async (sku) => {
    try {
      // Si el usuario es admin (LocatarioId = 0), asignamos 2
      const locatarioIdParaEliminar = locatarioId === 0 ? 2 : locatarioId;

      if (locatarioIdParaEliminar === undefined) {
        throw new Error("No se ha iniciado sesión o no se ha obtenido el LocatarioId.");
      }

      const confirmacion = window.confirm(`¿Seguro que deseas eliminar el producto con SKU: ${sku}?`);
      if (!confirmacion) return;

      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVER}/api/eliminar-producto?Locatarioid=${locatarioIdParaEliminar}&Prodssku=${sku}`
      );

      toast.success("Producto eliminado correctamente");
      fetchProductos(); // Actualizar la lista de productos después de eliminar
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast.error("Error al eliminar el producto");
    }
  };

  // Función para abrir el modal de imágenes
  const handleOpenImageModal = (imagenes) => {
    setCurrentProductImages(imagenes); // Guardar todas las imágenes
    setCurrentImageIndex(0); // Empezar desde la primera imagen
    setIsImageModalOpen(true);
  };

  // Función para cerrar el modal de imágenes
  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setCurrentProductImages([]);
    setCurrentImageIndex(0);
  };

  // Función para navegar a la siguiente imagen
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentProductImages.length);
  };

  // Función para navegar a la imagen anterior
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentProductImages.length) % currentProductImages.length);
  };

  // Efecto para cargar los productos al montar el componente
  useEffect(() => {
    if (locatarioId !== undefined) {
      fetchProductos();
    }
  }, [locatarioId]);

  // Efecto para buscar productos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.length > 2) {
      buscarProductosPorDescripcion(searchTerm);
    } else if (searchTerm === "") {
      fetchProductos();
    }
  }, [searchTerm]);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const openUpdateModal = (producto) => {
    setSelectedProduct(producto);
    setEditModalOpen(true);
  };

  const closeUpdateModal = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-5 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Productos Registrados</h2>
      <ToastContainer />

      {/* Campo de búsqueda */}
      <div className="mb-6">
        <label className="block font-semibold text-gray-700 mb-2" htmlFor="search">
          Buscar por descripción <FontAwesomeIcon icon={faMagnifyingGlass} />
        </label>
        <input
          id="search"
          type="text"
          placeholder="Ejemplo: Juguete"
          className="w-full border border-indigo-700 rounded-lg px-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Botón para crear nuevo producto */}
      <div className="md:col-span-2 py-2">
        <button title="Crear Producto" onClick={toggleModal} className="text-blue-600 hover:text-blue-800">
          <FontAwesomeIcon icon={faFile} size="3x" />
        </button>
      </div>

      {/* Tabla de productos */}
      {productos.length === 0 ? (
        <p className="text-center text-gray-500">No hay productos registrados.</p>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full bg-white shadow-lg table-auto border-collapse">
            <thead className="bg-gray-200 text-gray-600 tracking-wider">
              <tr>
                <th className="px-4 py-3 border-b">Descripción</th>
                <th className="px-4 py-3 border-b">SKU</th>
                <th className="px-4 py-3 border-b">Precio</th>
                <th className="px-4 py-3 border-b">Línea</th>
                <th className="px-4 py-3 border-b">Piratería</th>
                <th className="px-4 py-3 border-b">Imagen</th>
                <th className="px-4 py-3 border-b">Observaciones</th>
                {currentUser.role === "admin" ? (
                  <th className="px-4 py-3 border-b">Locatario</th>
                ) : (
                  ""
                )}
                <th className="px-4 py-3 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-100">
                  <td className="px-4 py-3 border-b">{producto.ProdsDescrip}</td>
                  <td className="px-4 py-3 border-b text-center">{producto.ProdsSKU || "N/A"}</td>
                  <td className="px-4 py-3 border-b text-center">{producto.ProdsPrecio1}</td>
                  <td className="px-4 py-3 border-b">{producto.ProdsLinea}</td>
                  <td className="px-4 py-3 border-b">{producto.ProdsChek1 ? "Sí" : "No"}</td>
                  <td className="px-4 py-3 border-b">
                    {producto.imagenes?.length > 0 && (
                      <img
                        src={producto.imagenes[0].ImgProdUrl} // Mostrar la primera imagen
                        alt="Imagen del producto"
                        className="w-10 h-10 cursor-pointer"
                        onClick={() => handleOpenImageModal(producto.imagenes)} // Abrir el modal de imágenes
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 border-b">{producto.ProdsObserv || "N/A"}</td>
                  {currentUser.role === "admin" ? (
                    <td className="px-4 py-3 border-b">{producto.LocatarioId}</td>
                  ) : (
                    ""
                  )}
                  <td className="px-3 py-3 border-b flex space-x-5">
                    <button
                      title="Editar Producto"
                      className="text-indigo-600 hover:text-indigo-700 flex items-center"
                      onClick={() => openUpdateModal(producto)}
                    >
                      <FontAwesomeIcon icon={faEdit} size="2xl" />
                    </button>
                    <button
                      title="Eliminar Producto"
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                      onClick={() => handleEliminarProducto(producto.ProdsSKU)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para crear nuevo producto */}
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

      {/* Modal para editar producto */}
      {editModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-200 rounded-xl shadow-lg p-8 w-full max-w-4xl relative overflow-y-auto max-h-screen">
            <RegisterProduct
              toggleModal={closeUpdateModal}
              initialData={{
                ProdId: selectedProduct.ProdId,
                sku: selectedProduct.ProdsSKU,
                description: selectedProduct.ProdsDescrip,
                cost: selectedProduct.ProdsCosto,
                price: selectedProduct.ProdsPrecio1,
                line: selectedProduct.ProdsLinea,
                subfamily: selectedProduct.ProdsFamilia,
                piracy: Boolean(selectedProduct.ProdsChek1),
                observations: selectedProduct.ProdsObserv,
              }}
              onProductCreated={fetchProductos}
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

      {/* Modal para mostrar imágenes */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4">Imágenes del Producto</h3>
            <div className="relative">
              <img
                src={currentProductImages[currentImageIndex].ImgProdUrl}
                alt="Imagen del producto"
                className="w-full h-auto"
              />
              {currentProductImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                  >
                    &gt;
                  </button>
                </>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseImageModal}
                className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;