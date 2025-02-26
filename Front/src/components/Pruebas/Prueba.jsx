import { useEffect, useState } from "react";
import axios from "axios";

const Prueba = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      const fecthData = async () => {
        
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/data`)
            setData(response.data)
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
      }

      fecthData()
    }, [])
    

    return (
        <div>
            <h1>Datos desde SQL Server</h1>
            <ul>
                {data.map((dat, index) => (
                    <li key={index}>{JSON.stringify(dat)} {''}</li>
                ) )}
            </ul>
        </div>
    );
};

export default Prueba;
