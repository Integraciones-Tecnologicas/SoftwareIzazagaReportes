import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { CiSearch } from "react-icons/ci";
import useStore from "../store/store";
import ErrorMessage from "./ErrorMessage";
import { useState, useEffect } from "react";
import Prueba3 from "./Pruebas/Prueba3";

const FormRegister = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
    const addTenant = useStore((state) => state.addTenant);
    const tenants = useStore((state) => state.tenants);
    const nameTenant = watch("nameTenant"); // Escuchar cambios en el input de nombre
    const deleteTenant = useStore((state) => state.deleteTenant);
  
    useEffect(() => {
        if (nameTenant) {
            // Buscar coincidencias exactas primero
            const exactMatch = tenants.find(tenant => tenant.nameTenant.toLowerCase() === nameTenant.toLowerCase());
            
            if (exactMatch) {
            // Si hay una coincidencia exacta, rellenar los campos con esa información
            setValue("email", exactMatch.email);
            setValue("address", exactMatch.address);
            setValue("password", exactMatch.password);
            setValue("telTenant", exactMatch.telTenant);
            setValue("rfc", exactMatch.rfc);
            setValue("contactName", exactMatch.contactName);
            setValue("telContact", exactMatch.telContact);
            setValue("local", exactMatch.local);
            } else {
            // Si no hay coincidencia exacta, buscar coincidencias parciales
                const partialMatches = tenants.filter(tenant => tenant.nameTenant.toLowerCase().includes(nameTenant.toLowerCase()));
                
                if (partialMatches.length > 0) {
                    // Si hay coincidencias parciales, rellenar con la primera coincidencia
                    const firstPartialMatch = partialMatches[0];
                    setValue("email", firstPartialMatch.email);
                    setValue("address", firstPartialMatch.address);
                    setValue("password", firstPartialMatch.password);
                    setValue("telTenant", firstPartialMatch.telTenant);
                    setValue("rfc", firstPartialMatch.rfc);
                    setValue("contactName", firstPartialMatch.contactName);
                    setValue("telContact", firstPartialMatch.telContact);
                    setValue("local", firstPartialMatch.local);
                    } else {
                        // Si no hay coincidencias, limpiar los campos
                        reset({
                        email: "",
                        address: "",
                        password: "",
                        telTenant: "",
                        rfc: "",
                        contactName: "",
                        telContact: "",
                        local: "",
                        });
                    }
            }
        }
    }, [nameTenant, tenants, setValue, reset]);

    // Función para manejar cambios en el nombre y llenar campos si el locatario ya existe
    const handleNameChange = (event) => {
        const name = event.target.value;
        const existingTenant = tenants.find(tenant => tenant.nameTenant === name);

        if (existingTenant) {
            // Llenar automáticamente los campos con los datos del locatario existente
            setValue("email", existingTenant.email);
            setValue("password", existingTenant.password);
            setValue("address", existingTenant.address);
            setValue("telTenant", existingTenant.telTenant);
            setValue("rfc", existingTenant.rfc);
            setValue("contactName", existingTenant.contactName);
            setValue("telContact", existingTenant.telContact);
            setValue("local", existingTenant.local);
        }
    };

    const handleClearForm = () => {
        reset({
            nameTenant: "",
            email: "",
            address: "",
            password: "",
            telTenant: "",
            rfc: "",
            contactName: "",
            telContact: "",
            local: "",
          }); // Limpiar todos los campos
      };

    const registerTenant = (data) => {
        const existingTenant = tenants.find(tenant => tenant.nameTenant === data.nameTenant);
        const emailInUse = tenants.find(tenant => tenant.email === data.email && tenant.nameTenant !== data.nameTenant);
      
        if (emailInUse) {
          toast.error("Este correo ya está registrado por otro locatario. Usa otro.");
          return;
        }
      
        toast.success(existingTenant ? "Locatario actualizado correctamente" : "Locatario agregado correctamente");
        addTenant(data);
        reset();
    };

    const handleDeleteTenant = () => {
        const confirmDelete = window.confirm(
          `¿Estás seguro de que deseas eliminar al locatario "${nameTenant}"?`
        );
      
        if (confirmDelete) {
          // Eliminar el locatario del estado global
          deleteTenant(nameTenant);
      
          // Limpiar el formulario después de eliminar
          handleClearForm();
      
          // Mostrar un mensaje de éxito
          toast.success(`Locatario "${nameTenant}" eliminado correctamente`);
        }
    };


    console.log(tenants)
  
    return (
      <>
        <ToastContainer />
        <div className="mx-auto max-w-5xl mt-10 p-5 bg-white shadow-md rounded-md">
        <Prueba3 />

        {tenants && (
            <div className="mt-10">
            <h3 className="font-bold text-xl mb-4">Usuarios Registrados</h3>
            <ul>
                {tenants.map((tenant, index) => (
                <li key={tenant.id} className="mb-2 p-3 border border-gray-300 rounded-md">
                    <p><strong>Nombre:</strong> {tenant.nameTenant}</p>
                    <p><strong>Usuario:</strong> {tenant.email}</p>
                    <p><strong>Dirección:</strong> {tenant.address}</p>
                    <p><strong>Teléfono:</strong> {tenant.telTenant}</p>
                    <p><strong>RFC:</strong> {tenant.rfc}</p>
                    <p><strong>Nombre de Contacto:</strong> {tenant.contactName}</p>
                    <p><strong>Teléfono de Contacto:</strong> {tenant.telContact}</p>
                    <p><strong>Local:</strong> {tenant.local}</p>
                </li>
                ))}
            </ul>
            </div>
        )}

          <h2 className="font-bold text-2xl text-center mb-8">Datos Generales Locatarios</h2>
  
          <form noValidate onSubmit={handleSubmit(registerTenant)}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-9">
                <label htmlFor="nameTenant" className="font-bold text-gray-700">
                  Nombre <CiSearch className="inline text-xl"/>
                </label>
                <input  
                  id="nameTenant"
                  className="w-full p-3 border border-gray-500 rounded-md"  
                  type="text" 
                  placeholder="Nombre del Locatario"
                  onChange={handleNameChange}
                  {...register('nameTenant', {
                    required: 'El Nombre del Locatario es Obligatorio'
                  })}
                />
                {errors.nameTenant && (
                  <ErrorMessage>{errors.nameTenant?.message}</ErrorMessage>
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
                {nameTenant && tenants.some(tenant => tenant.nameTenant === nameTenant) && (
                    <button
                    type="button"
                    onClick={handleDeleteTenant}
                    className="text-red-500 hover:text-red-700 text-sm"
                    >
                    🗑️ Eliminar
                    </button>
                )}
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
  );
};

export default FormRegister;