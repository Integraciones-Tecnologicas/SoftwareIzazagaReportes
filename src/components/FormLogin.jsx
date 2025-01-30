import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store";
import ErrorMessage from "./ErrorMessage";
import { toast, ToastContainer } from "react-toastify";

const FormLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const { email, password } = data;
    const isAuthenticated = login(email, password);

    if (isAuthenticated) {
      toast.success("Inicio de sesión exitoso");
      navigate("/"); // Redirigir al home después del login
    } else {
      toast.error("Credenciales incorrectas");
    }
  };

  return (
    <div className="sm:4/5 md:w-1/2 lg:w-2/5 mx-5 bg-white shadow-xl rounded-xl p-6">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Iniciar Sesión</h2>
      <ToastContainer />
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-5">
          <label htmlFor="email" className="text-sm uppercase font-bold">
            Correo Electrónico
          </label>
          <input
            id="email"
            className="w-full p-3 border border-gray-500 rounded-md"
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