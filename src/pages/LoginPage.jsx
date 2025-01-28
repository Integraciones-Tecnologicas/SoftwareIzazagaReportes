import FormLogin from "../components/FormLogin"


const Index = () => {
  return (
    <div className="container mx-auto mt-10">
        <h1 className="font-black text-4xl text-center md:2/3 md:mx-auto">Sistema de Ingreso de Mercancia {''}<br></br>
        <span className="text-indigo-600">Plaza Izazaga</span>
        </h1>

        <div className="mt-10 md:flex md:justify-between">
          <FormLogin />
          <img src="../img_1.jpg" alt="Imagen" className="h-auto mx-auto max-w-full md:w-1/2 rounded-lg"/>
        </div>
      </div>
  )
}

export default Index