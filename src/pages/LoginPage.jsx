import FormLogin from "../components/FormLogin";

const Index = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: "url('/bg-login.webp')" }}
    >
      <div className="container mx-auto px-4">
        <h1 className="font-black text-4xl text-center text-white mb-20">
          Sistema de Ingreso de Mercancia <br />
          <span className="text-indigo-300 ">Plaza Izazaga</span>
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center">
          <FormLogin />
          
        </div>
      </div>
    </div>
  );
};

export default Index;
