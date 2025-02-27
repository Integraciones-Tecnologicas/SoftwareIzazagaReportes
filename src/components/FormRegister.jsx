import axios from 'axios';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { CiSearch } from "react-icons/ci";
import ErrorMessage from "./ErrorMessage";
import { useState, useEffect } from "react";
import Prueba3 from "./Pruebas/Prueba3";

const FormRegister = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
    const nameTenant = watch("nameTenant");
    const [searchResults, setSearchResults] = useState([]);
    const [locatarioId, setLocatarioId] = useState(null); // Estado para almacenar el ID del locatario

    const buscarLocatarios = async (nombre) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_SERVER}/api/buscar-locatario?nombre=${nombre}`
            );
            setSearchResults(response.data.SDTBuscaLocatario || []);
        } catch (error) {
            console.error("Error al buscar locatarios:", error);
            toast.error("Hubo un error al buscar locatarios.");
        }
    };

    useEffect(() => {
        if (nameTenant && nameTenant.length >= 3) {
            buscarLocatarios(nameTenant);
        } else {
            setSearchResults([]);
        }
    }, [nameTenant]);

    const handleSelectLocatario = async (locatario) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_SERVER}/api/locatario/${locatario.LocatarioId}`
            );
            const locatarioData = response.data;

            // Llenar los campos del formulario
            setValue("nameTenant", locatarioData.LocatarioNombre);
            setValue("email", locatarioData.LocatarioEmail);
            setValue("address", locatarioData.LocatarioDireccion);
            setValue("telTenant", locatarioData.LocatarioTelefono);
            setValue("telTenant2", locatarioData.LocatarioTel2 || "");
            setValue("rfc", locatarioData.LocatarioRFC || "");
            setValue("contactName", locatarioData.LocatarioNomContacto);
            setValue("telContact", locatarioData.LocatarioTelContacto || "");
            setValue("observ", locatarioData.LocatarioObservacion || "");
            setValue("local", locatarioData.LocatarioActivo || "");

            // Guardar el ID del locatario
            setLocatarioId(locatarioData.LocatarioId);

            setSearchResults([]);
        } catch (error) {
            console.error("Error al obtener detalles del locatario:", error);
            toast.error("Hubo un error al cargar los detalles del locatario.");
        }
    };

    const registerTenant = async (data) => {
        try {
            if (locatarioId) {
                // Si hay un LocatarioId, actualizar el locatario
                const response = await axios.post(
                    `${import.meta.env.VITE_API_SERVER}/api/actualizar-locatario`,
                    {
                        LocatarioId: locatarioId,
                        LocatarioNombre: data.nameTenant,
                        LocatarioDireccion: data.address,
                        LocatarioEmail: data.email,
                        UsuId: "1",
                        LocatarioTelefono: data.telTenant,
                        LocatarioTel2: data.telTenant2 || "",
                        LocatarioRFC: data.rfc || "",
                        LocatarioNomContacto: data.contactName,
                        LocatarioTelContacto: data.telContact || "",
                        LocatarioActivo: "S",
                        LocatarioObservacion: data.observ || ""
                    }
                );
                toast.success("Locatario actualizado correctamente");
            } else {
                // Si no hay un LocatarioId, registrar un nuevo locatario
                const response = await axios.post(
                    `${import.meta.env.VITE_API_SERVER}/api/locatario`,
                    {
                        LocatarioNombre: data.nameTenant,
                        LocatarioDireccion: data.address,
                        LocatarioEmail: data.email,
                        UsuId: "1",
                        LocatarioTelefono: data.telTenant,
                        LocatarioTel2: data.telTenant2 || "",
                        LocatarioRFC: data.rfc || "",
                        LocatarioNomContacto: data.contactName,
                        LocatarioTelContacto: data.telContact || "",
                        LocatarioActivo: "S",
                        LocatarioObservacion: data.observ || ""
                    }
                );
                toast.success("Locatario registrado correctamente");
            }
            reset();
            setLocatarioId(null); // Limpiar el ID después de guardar
        } catch (error) {
            console.error("Error al registrar/actualizar el locatario:", error);
            toast.error("Hubo un error al registrar/actualizar el locatario.");
        }
    };

    const handleClearForm = () => {
        reset({
            nameTenant: "",
            email: "",
            address: "",
            password: "",
            telTenant: "",
            telTenant2: "",
            rfc: "",
            contactName: "",
            telContact: "",
            observ: "",
            local: "",
        });
        setSearchResults([]);
        setLocatarioId(null); // Limpiar el ID al limpiar el formulario
    };


    return (
        <>
            <ToastContainer />
            <div className="mx-auto max-w-5xl mt-10 p-5 bg-white shadow-md rounded-md">
                <Prueba3 />

                <h2 className="font-bold text-2xl text-center mb-8">Datos Generales Locatarios</h2>

                <form noValidate onSubmit={handleSubmit(registerTenant)}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-9">
                            <label htmlFor="nameTenant" className="font-bold text-gray-700">
                                Nombre <CiSearch className="inline text-xl" />
                            </label>
                            <input
                                id="nameTenant"
                                className="w-full p-3 border border-gray-500 rounded-md"
                                type="text"
                                placeholder="Nombre del Locatario"
                                {...register('nameTenant', {
                                    required: 'El Nombre del Locatario es Obligatorio'
                                })}
                            />
                            {errors.nameTenant && (
                                <ErrorMessage>{errors.nameTenant?.message}</ErrorMessage>
                            )}
                            {/* Mostrar resultados de la búsqueda */}
                            {searchResults.length > 0 && (
                                <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                                    {searchResults.map((locatario) => (
                                        <li
                                            key={locatario.LocatarioId}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSelectLocatario(locatario)}
                                        >
                                            {locatario.LocatarioNombre}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <button
                                type="button"
                                onClick={handleClearForm}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                ❌ Limpiar
                            </button>
                        </div>
                        
                        <div className="md:col-span-6">
                            <label htmlFor="email" className="font-bold text-gray-700">
                                Usuario
                            </label>
                            <input
                                id="email"
                                className="w-full p-3 border border-gray-500 rounded-md"
                                type="email"
                                placeholder="Usuario del Locatario"
                                {...register('email', {
                                    required: 'El Usuario del locatario es Obligatoria'
                                })}
                            />
                            {errors.email && (
                                <ErrorMessage>{errors.email?.message}</ErrorMessage>
                            )}
                        </div>

                    <div className="md:col-span-6">
                    <label htmlFor="password" className="text-gray-700 font-bold">
                        Contraseña
                    </label>
                    <input  
                        id="password"
                        className="w-full p-3 border border-gray-500 rounded-md"  
                        type="password" 
                        placeholder="Contraseña del Locatario"
                        {...register('password', {
                        required: 'La contraseña del locatario es Obligatoria'
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password?.message}</ErrorMessage>
                    )}
                    </div>

                            <div className="md:col-span-6">
                                <label htmlFor="address" className="text-gray-700 font-bold">
                                    Dirección
                                </label>
                                <input  
                                    id="address"
                                    className="w-full p-3 border border-gray-500 rounded-md"  
                                    type="text" 
                                    placeholder="Dirección del Locatario"
                                    {...register('address', {
                                        required: 'La dirección del locatario es Obligatoria'
                                    })}
                                />
                                
                                {errors.address && (
                                    <ErrorMessage>{errors.address?.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="md:col-span-6">
                                <label htmlFor="telTenant" className="text-gray-700 font-bold">
                                    Teléfono
                                </label>
                                <input  
                                    id="telTenant"
                                    className="w-full p-3 border border-gray-500 rounded-md"  
                                    type="text" 
                                    placeholder="Teléfono del Locatario"
                                    {...register('telTenant', {
                                        required: 'El teléfono del locatario es Obligatorio'
                                    })}
                                />

                                {errors.telTenant && (
                                    <ErrorMessage>{errors.telTenant?.message}</ErrorMessage>
                                )}
                            </div>

                            <div className="md:col-span-6">
                                <label htmlFor="telTenant2" className="text-gray-700 font-bold">
                                    Teléfono Secundario
                                </label>
                                <input  
                                    id="telTenant2"
                                    className="w-full p-3 border border-gray-500 rounded-md"  
                                    type="text" 
                                    placeholder="Teléfono secundario del Locatario (opcional)"
                                    {...register('telTenant2')}
                                />
                            </div>

                            <div className="md:col-span-8">
                                <label htmlFor="rfc" className="text-gray-700 font-bold">
                                    RFC
                                </label>
                                <input  
                                    id="rfc"
                                    className="w-full p-3 border border-gray-500 rounded-md"  
                                    type="text" 
                                    placeholder="RFC del Locatario"
                                    {...register('rfc', {
                                        required: 'El RFC del locatario es Obligatorio'
                                    })}
                                />

                                {errors.rfc && (
                                    <ErrorMessage>{errors.rfc?.message}</ErrorMessage>
                                )} 
                            </div>

                            <div className="md:col-span-6">
                                <label htmlFor="contactName" className="text-gray-700 font-bold">
                                    Nombre Contacto 
                                </label>
                                <input  
                                    id="contactName"
                                    className="w-full p-3 border border-gray-500 rounded-md"  
                                    type="text" 
                                    placeholder="Nombre Contacto"
                                    {...register('contactName')}
                                />
                                
                            </div>

                            <div className="md:col-span-6">
                                <label htmlFor="telContact" className="text-gray-700 font-bold">
                                    Teléfono Contacto
                                </label>
                                <input  
                                    id="telContact"
                                    className="w-full p-3 border border-gray-500 rounded-md"  
                                    type="text" 
                                    placeholder="Teléfono del Contacto" 
                                    {...register('telContact')}
                                />
                                 
                            </div>

                            <div className="md:col-span-6">
                                <label htmlFor="observ" className="text-gray-700 font-bold">
                                    Observaciones
                                </label>
                                <textarea  
                                    id="observ"
                                    className="w-full p-3 border border-gray-500 rounded-md"  
                                    name="observ"
                                    {...register('observ')}
                                ></textarea>
                                
                            </div>

                            <div className="md:col-span-6 flex items-center mt-4">
                                <label 
                                    htmlFor="local"
                                    className="block text-gray-700  text-base font-bold mb-2 mr-2"
                                >Locales</label>
                                <select
                                    name="local" 
                                    id="local" 
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    {...register('local', {
                                        required: 'Selecciona al menos un local'
                                    })}
                                >
                                    <option value="">--Seleccione--</option>
                                    <option value="100">100</option>
                                    <option value="200">200</option>
                                </select>

                                {errors.local && (
                                    <ErrorMessage>{errors.local?.message}</ErrorMessage>
                                )} 
                            </div>
                        </div>
                        
                        <div className="flex justify-end mt-5">
                            <input
                            type="submit"
                            className="bg-indigo-600 w-full p-3 uppercase text-white font-bold hover:bg-indigo-700 cursor-pointer transition-colors"
                            value='Registrar'
                            />
                        </div>
                </form> 
            </div>
    </>
  );
};

export default FormRegister;