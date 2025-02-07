import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; // Importar axios
import ErrorMessage from '../ErrorMessage';
import useStore from '../../store/store';

const Prueba2 = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  // Función para enviar los datos a la API
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Hacer la solicitud POST con axios
      const response = await axios.post('http://localhost:5000/api/login', {
        Cuenta: data.cuenta,
        Password: data.password,
      });

      // Si la solicitud es exitosa
      toast.success('Inicio de sesión exitoso');
      console.log('Respuesta de la API:', response.data);
      
    } catch (error) {
      // Manejar errores
      console.error('Error:', error);
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        toast.error(`Error: ${error.response.data.message || 'Error en la solicitud'}`);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        toast.error('No se recibió respuesta del servidor');
      } else {
        // Algo salió mal al configurar la solicitud
        toast.error('Error al configurar la solicitud');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="mx-auto max-w-5xl mt-10 p-5 bg-white shadow-md rounded-md">
        <h2 className="font-bold text-2xl text-center mb-8">Prueba de Inicio de Sesión</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Campo: Cuenta */}
            <div className="md:col-span-6">
              <label htmlFor="cuenta" className="font-bold text-gray-700">
                Cuenta
              </label>
              <input
                id="cuenta"
                className="w-full p-3 border border-gray-500 rounded-md"
                type="text"
                placeholder="Ingresa tu cuenta"
                {...register('cuenta', {
                  required: 'La cuenta es obligatoria',
                })}
              />
              {errors.cuenta && (
                <ErrorMessage>{errors.cuenta.message}</ErrorMessage>
              )}
            </div>

            {/* Campo: Contraseña */}
            <div className="md:col-span-6">
              <label htmlFor="password" className="font-bold text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                className="w-full p-3 border border-gray-500 rounded-md"
                type="password"
                placeholder="Ingresa tu contraseña"
                {...register('password', {
                  required: 'La contraseña es obligatoria',
                })}
              />
              {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
            </div>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-end mt-5">
            <input
              type="submit"
              className="bg-indigo-600 w-full p-3 uppercase text-white font-bold hover:bg-indigo-700 cursor-pointer transition-colors"
              value={loading ? 'Cargando...' : 'Iniciar Sesión'}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Prueba2;