import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";
import axios from "axios";


const FormRegister = () => {

    const buscarLocatario = async (nombre) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/buscar-locatario?nombre=${nombre}`);
            console.log("Locatario encontrado:", response.data);
            // Aquí puedes actualizar el estado o mostrar los resultados en la interfaz
        } catch (error) {
            console.error("Error al buscar el locatario:", error);
            toast.error("Hubo un error al buscar el locatario.");
        }
    };

    const handleSearch = () => {
        if (nameTenant) {
            buscarLocatario(nameTenant);
        }
    };
  
    return (
      <>
        <label htmlFor="nameTenant" className="font-bold text-gray-700">
                    Buscar <CiSearch className="inline text-xl"/>
                    </label>
                    <input  
                    id="nameTenant"
                    className="w-full p-3 border border-gray-500 rounded-md"  
                    type="text" 
                    placeholder="Buscar del Locatario"
                    onChange={handleSearch}
                    
        />
    </>
  );
};

export default FormRegister;