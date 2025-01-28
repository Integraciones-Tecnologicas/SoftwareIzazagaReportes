import useStore from "../store";
import { data, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

const FormLogin = () => {
  const { register, handleSubmit, formState: { errors }}= useForm();
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // Autenticación simulada
    if (data.user === "admin" && data.password === "1234") {
      login({ name: "Admin", role: "admin" }); // Guardamos usuario en el estado global
      
    }
  };

  return (

    <div className="sm:4/5 md:w-1/2 lg:w-2/5 mx-5 bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Iniciar Sesión</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-5">
            <label htmlFor="user" className="text-sm uppercase font-bold">
            Usuario
            </label>
            <input
            id="user"
            className="w-full p-3 border border-gray-500 rounded-md"
            type="text"
            placeholder="Usuario"
            {...register("user", { 
                required: "El usuario es obligatorio"
             })}
            />

                {errors.user && (
                    <ErrorMessage>{errors.user.message}</ErrorMessage>
                )}

        </div>
        <div className="mb-5">
            <label htmlFor="password" className="text-sm uppercase font-bold">
            Contraseña
            </label>
            <input
            id="password"
            className="w-full p-3 border border-gray-500 rounded-md"
            type="password"
            placeholder="Contraseña"
            {...register("password", { required: "La contraseña es obligatoria" })}
            />

            {errors.password && (
                 <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}

        </div>
        <input
            type="submit"
            className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-indigo-700 cursor-pointer transition-colors"
            value="Iniciar Sesión"
        />
        </form>
    </div>
  );
};

export default FormLogin;
