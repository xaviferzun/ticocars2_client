import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {getVehicleById} from "../services/vehicleService";

//Component to display the details of a specific vehicle
const VehicleDetail = () => {
  const {id} = useParams(); //Get ID from API
  const navigate = useNavigate(); //Hook to navigate between pages
  const [vehicle, setVehicle] = useState(null); //Store vehicle data
  const [loading, setLoading] = useState(true); //Loading state
  const [error, setError] = useState(""); //Error state

  //Hook to fetch vehicle data when the component mounts
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await getVehicleById(id);
        setVehicle(data);
      } catch (error) {
        setError(error.message || "Error al cargar el vehículo");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  //Go back
  const handleBack = () => {
    navigate("/vehicles");
  };

  //Warnings
  if (loading) {
    return <h2>Cargando...</h2>;
  }
  if (error) {
    return <h2>{error}</h2>;
  }
  if (!vehicle) {
    return <h2>Vehículo no encontrado</h2>;
  }
  return (
    <div>
      <h1>Detalle del Vehículo</h1>
      <p><strong>Marca:</strong> {vehicle.brand}</p>
      <p><strong>Modelo:</strong> {vehicle.model}</p>
      <p><strong>Año:</strong> {vehicle.year}</p>
      <p><strong>Precio:</strong> ${vehicle.price}</p>
      <p><strong>Estado:</strong> {vehicle.status}</p>
      <button onClick={handleBack}>Volver a la lista</button>    
    </div>
  );
};

export default VehicleDetail;