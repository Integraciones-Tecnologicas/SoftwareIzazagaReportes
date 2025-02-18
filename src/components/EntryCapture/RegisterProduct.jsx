import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import ErrorMessage from "../ErrorMessage";

const RegisterProduct = ({ toggleModal, initialData, onProductCreated }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    console.log("useEffect ejecutado. initialData:", initialData);
  
    if (initialData) {
      reset({
        ...initialData,
        piracy: Boolean(initialData.piracy), // Asegura que sea true o false
      });
    }
  }, [initialData, reset]);
  
  

  const registerProduct = async (data) => {
    try {
      const productoData = {
        ProdId: initialData?.ProdId || null,  // Solo se envía si es actualización
        LocatarioId: "1",
        ProdsSKU: data.sku,
        ProdsDescrip: data.description,
        ProdsLinea: data.line,
        ProdsFamilia: data.subfamily,
        ProdsCosto: data.cost,
        ProdsPrecio1: data.price,
        ProdsPrecio2: data.price,
        ProdsPrecio3: data.price,
        ProdsChek1: data.piracy ? "true" : "false",
        ProdsObserv: data.observations || "Ninguna",
        ProdsExistencia: "0",
      };

      console.log("Datos enviados a la API:", productoData);

      const endpoint = initialData?.ProdId
        ? "http://localhost:5000/api/actualizar-producto"
        : "http://localhost:5000/api/crear-producto";

      const response = await axios.post(endpoint, productoData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Respuesta de la API:", response.data);

      toast.success(initialData?.ProdId ? "Producto actualizado" : "Producto creado");
      reset();
      toggleModal();

      if (onProductCreated) {
        onProductCreated();
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || "Error desconocido"}`);
      } else {
        toast.error("Error de conexión con la API");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-3 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        {initialData ? "Editar Producto" : "Alta de Productos"}
      </h2>
      <ToastContainer />

      <form className="space-y-6 bg-white" onSubmit={handleSubmit(registerProduct)}>
        {/* Descripción */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <label htmlFor="description" className="w-full md:w-1/4 text-sm font-semibold text-gray-700 uppercase">
            Descripción:
          </label>
          <input
            type="text"
            id="description"
            className="w-full md:w-3/4 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Descripción del producto"
            {...register("description", { required: "La descripción es obligatoria" })}
          />
          {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
        </div>

        {/* SKU */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <label htmlFor="sku" className="w-full md:w-1/4 text-sm font-semibold text-gray-700 uppercase">
            SKU:
          </label>
          <input
            type="text"
            id="sku"
            className="w-full md:w-3/4 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Código para seguimiento"
            {...register("sku", { required: "El SKU es obligatorio" })}
          />
          {errors.sku && <ErrorMessage>{errors.sku.message}</ErrorMessage>}
        </div>

        {/* Costo y Precio */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <label htmlFor="cost" className="w-full md:w-1/4 text-sm font-semibold text-gray-700 uppercase">
            Costo:
          </label>
          <input
            type="number"
            min={0}
            id="cost"
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Costo del producto"
            {...register("cost", { required: "El costo es obligatorio" })}
          />
          {errors.cost && <ErrorMessage>{errors.cost.message}</ErrorMessage>}

          <label htmlFor="price" className="w-full md:w-1/4 text-sm font-semibold text-gray-700 uppercase">
            Precio V:
          </label>
          <input
            type="number"
            id="price"
            min={0}
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Precio de Venta"
            {...register("price", { required: "El precio de venta es obligatorio" })}
          />
          {errors.price && <ErrorMessage>{errors.price.message}</ErrorMessage>}
        </div>

        {/* Línea */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <label htmlFor="line" className="w-full md:w-1/4 text-sm font-semibold text-gray-700 uppercase">
            Línea:
          </label>
          <input
            type="text"
            id="line"
            className="w-full md:w-3/4 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Línea del producto"
            {...register("line", { required: "La línea es obligatoria" })}
          />
          {errors.line && <ErrorMessage>{errors.line.message}</ErrorMessage>}
        </div>

        {/* Subfamilia */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <label htmlFor="subfamily" className="w-full md:w-1/4 text-sm font-semibold text-gray-700 uppercase">
            Subfamilia:
          </label>
          <input
            type="text"
            id="subfamily"
            className="w-full md:w-3/4 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Subfamilia del producto"
            {...register("subfamily", { required: "La subfamilia es obligatoria" })}
          />
          {errors.subfamily && <ErrorMessage>{errors.subfamily.message}</ErrorMessage>}
        </div>

        {/* Piratería */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="piracy"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            {...register("piracy")}
            defaultChecked={initialData?.piracy} // Se asegura que se marque o desmarque correctamente
          />
          <label htmlFor="piracy" className="text-sm font-medium text-gray-700">
            Podría ser considerado piratería
          </label>
        </div>

        {/* Observaciones */}
        <div className="flex flex-col">
          <label htmlFor="observations" className="text-sm font-semibold text-gray-700 uppercase">
            Observaciones:
          </label>
          <textarea
            id="observations"
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            placeholder="Observaciones adicionales"
            {...register("observations")}
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 uppercase font-semibold"
          >
            {initialData ? "Actualizar Producto" : "Registrar Producto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterProduct;