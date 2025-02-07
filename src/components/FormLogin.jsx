import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store";
import ErrorMessage from "./ErrorMessage";
import { toast, ToastContainer } from "react-toastify";
import { FaUser } from "react-icons/fa"; // Importar el ícono de usuario
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

const FormLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      // Llamar a la función login (que ahora es asíncrona)
      const isAuthenticated = await login(email, password);

      if (isAuthenticated) {
        toast.success("Inicio de sesión exitoso");
        navigate("/"); // Redirigir al home después del login
      } else {
        toast.error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      toast.error("Error en el servidor. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <div className="w-full sm:w-4/5 md:w-1/2 lg:w-2/5 bg-white bg-opacity-50 shadow-xl rounded-xl p-8">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-white bg-opacity-60 p-4 -mt-14 rounded-full">
          <FaUser className="text-white text-3xl" /> {/* Ícono de usuario */}
        </div>
        <h2 className="text-3xl font-extrabold text-center mt-4 text-gray-800">Iniciar Sesión</h2>
      </div>
      <ToastContainer />
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-5">
          <label htmlFor="email" className="text-sm uppercase font-bold text-gray-700">
            Correo Electrónico
          </label>
          <input
            id="email"
            className="w-full bg-white/50 p-3 border-white border-4 rounded-md focus:outline-none focus:border-indigo-500"
            type="email"
            placeholder="Correo Electrónico"
            {...register("email", { 
              required: "El correo electrónico es obligatorio"
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <div className="flex h-10 items-center rounded-md border-4 border-input bg-white pl-3 text-base ring-offset-background focus-within:ring-1 focus-within:ring-ring focus:border-indigo-500 focus-within:ring-offset-2 bg-white/50">
          < FaUser/>
        <input
            className="w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-white/20"
            type="email"
            placeholder="Correo Electrónico"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="text-sm uppercase font-bold text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            className="w-full bg-white/50 p-3 border-white border-4 rounded-md focus:outline-none focus:border-indigo-500"
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
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-indigo-700 cursor-pointer transition-colors rounded-md"
          value="Iniciar Sesión"
        />
      </form>
    </div>
  );
};

export default FormLogin;