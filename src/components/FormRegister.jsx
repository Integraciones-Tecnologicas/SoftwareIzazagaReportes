import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import useStore from "../store"; // Importamos el store
import ErrorMessage from "./ErrorMessage";

const FormRegister = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const addTenant = useStore((state) => state.addTenant); // Obtenemos la función para agregar locatarios

    const registerTenant = (data) => {
        toast.success('Locatario Agregado Correctamente')
        addTenant(data); // Agregamos los datos al store
        console.log("Locatario registrado:", data); // Confirmar que se registran los datos en la consola
        reset()
    };

    const tenants = useStore((state) => state.tenants);
    return (
        <>        
            <ToastContainer />
            <div className="mx-auto max-w-5xl mt-10 p-5 bg-white shadow-md rounded-md">
                <h2 className="font-bold text-2xl text-center mb-8">Datos Generales Locatarios</h2>

                <form 
                    noValidate
                    onSubmit={handleSubmit(registerTenant)}
                >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-9">
                        <label htmlFor="nameTenant" className="font-bold text-gray-700">
                            Nombre 
                        </label>
                        <input  
                            id="nameTenant"
                            className="w-full p-3 border border-gray-500 rounded-md"  
                            type="text" 
                            placeholder="Nombre del locatario"
                            {...register('nameTenant', {
                                required: 'El Nombre del Locatario es Obligatorio'
                            })}
                        />

                        {errors.nameTenant && (
                            <ErrorMessage>{errors.nameTenant?.message}</ErrorMessage>
                        )}
                        
                    </div>
                    
                    <div className="md:col-span-6">
                        <label htmlFor="email" className="font-bold text-gray-700">
                            E-mail
                        </label>
                        <input  
                            id="email"
                            className="w-full p-3 border border-gray-500 rounded-md"  
                            type="text" 
                            placeholder="Email del locatario"
                            {...register('email', {
                                required: 'La dirección del locatario es Obligatorio',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email no válido"
                                    }
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
                            placeholder="La contraseña del locatario"
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
                            placeholder="Dirección del locatario"
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
                            placeholder="Teléfono del locatario"
                            {...register('telTenant', {
                                required: 'El teléfono del locatario es Obligatorio'
                            })}
                        />

                        {errors.telTenant && (
                            <ErrorMessage>{errors.telTenant?.message}</ErrorMessage>
                        )}

                    </div>

                    <div className="md:col-span-8">
                        <label htmlFor="rfc" className="text-gray-700 font-bold">
                            RFC
                        </label>
                        <input  
                            id="rfc"
                            className="w-full p-3 border border-gray-500 rounded-md"  
                            type="rfc" 
                            placeholder="RFC del locatario"
                            {...register('rfc', {
                                required: 'El rfc del locatario es Obligatorio'
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
                            type="contactName" 
                            placeholder="Nombre Contacto"
                            {...register('contactName', {
                                required: 'El Nombre de Contacto del locatario es Obligatorio'
                            })}
                        />

                        {errors.contactName && (
                            <ErrorMessage>{errors.contactName?.message}</ErrorMessage>
                        )}  

                        
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
                            {...register('telContact', {
                                required: 'El teléfono de Contacto es Obligatorio'
                            })}
                        />

                        {errors.telContact && (
                            <ErrorMessage>{errors.telContact?.message}</ErrorMessage>
                        )} 
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

    )
}

export default FormRegister