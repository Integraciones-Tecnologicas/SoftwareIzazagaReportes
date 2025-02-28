import axios from 'axios';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { CiSearch } from "react-icons/ci";
import ErrorMessage from "./ErrorMessage";
import { useState, useEffect } from "react";

const FormRegister = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
    const nameTenant = watch("nameTenant");
    const [searchResults, setSearchResults] = useState([]);
    const [locatarioId, setLocatarioId] = useState(null);

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
            setValue("usuario", locatarioData.UsuCuenta || "");
            setValue("password", locatarioData.UsuPassword || "");

            setLocatarioId(locatarioData.LocatarioId);
            setSearchResults([]);
        } catch (error) {
            console.error("Error al obtener detalles del locatario:", error);
            toast.error("Hubo un error al cargar los detalles del locatario.");
        }
    };

    const registerTenant = async (data) => {
        try {
            const payload = locatarioId
                ? {
                    LocatarioId: locatarioId, // Incluir el ID para actualizar
                    LocatarioNombre: data.nameTenant,
                    LocatarioDireccion: data.address,
                    LocatarioEmail: data.email,
                    UsuId: "1", // Asumiendo que UsuId es un valor fijo o dinámico
                    LocatarioTelefono: data.telTenant,
                    LocatarioTel2: data.telTenant2 || "",
                    LocatarioRFC: data.rfc || "",
                    LocatarioNomContacto: data.contactName,
                    LocatarioTelContacto: data.telContact || "",
                    LocatarioActivo: "S",
                    LocatarioObservacion: data.observ || "",
                    UsuCuenta: data.usuario,
                    UsuPassword: data.password
                }
                : {
                    SDTCuentaLocatario: {
                        LocatarioNombre: data.nameTenant,
                        LocatarioDireccion: data.address,
                        LocatarioEmail: "", // Email vacío como solicitado
                        UsuId: "1", // Asumiendo que UsuId es un valor fijo o dinámico
                        LocatarioTelefono: data.telTenant,
                        LocatarioTel2: data.telTenant2 || "",
                        LocatarioRFC: data.rfc || "",
                        LocatarioNomContacto: data.contactName,
                        LocatarioTelContacto: data.telContact || "",
                        LocatarioActivo: "S",
                        LocatarioObservacion: data.observ || "",
                        UsuCuenta: data.usuario,
                        UsuPassword: data.password
                    }
                };
    
            console.log("Payload enviado:", payload); // Depuración
    
            const url = locatarioId
                ? `${import.meta.env.VITE_API_SERVER}/api/actualizar-locatario`
                : `${import.meta.env.VITE_API_SERVER}/api/locatario`;
    
            const response = await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'application/json', // Asegúrate de que el header esté configurado
                },
            });
    
            toast.success(locatarioId ? "Locatario actualizado correctamente" : "Locatario registrado correctamente");
            reset();
            setLocatarioId(null);
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
            usuario: ""
        });
        setSearchResults([]);
        setLocatarioId(null);
    };

    return (
        <>
            <ToastContainer />
            <div className="mx-auto max-w-5xl mt-10 p-5 bg-white shadow-md rounded-md">
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
                            <label htmlFor="usuario" className="font-bold text-gray-700">
                                Usuario
                            </label>
                            <input
                                id="usuario"
                                className="w-full p-3 border border-gray-500 rounded-md"
                                type="text"
                                placeholder="Usuario del Locatario"
                                {...register('usuario', {
                                    required: 'El Usuario del locatario es Obligatorio'
                                })}
                            />
                            {errors.usuario && (
                                <ErrorMessage>{errors.usuario?.message}</ErrorMessage>
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
                                {...register('observ')}
                            ></textarea>
                        </div>

                        <div className="md:col-span-6 flex items-center mt-4">
                            <label
                                htmlFor="local"
                                className="block text-gray-700 text-base font-bold mb-2 mr-2"
                            >
                                Locales
                            </label>
                            <select
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
                            value={locatarioId ? 'Actualizar' : 'Registrar'}
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default FormRegister;