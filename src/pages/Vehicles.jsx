import {useEffect, useState} from "react";
import {getVehicles} from "../services/vehicleService";
import VehicleCard from "../components/VehicleCard";

//Component to display the list of vehicles
function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Hook to fetch vehicles from the API when the component mounts
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data.results);
      } catch (error) {
        setError("Error al cargar los vehículos");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  //Warnings
  if (loading) {
    return <p>Cargando...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div>
      <h1>Lista de Vehículos</h1>
      {vehicles.length === 0 ? (
        <p>No se encontraron vehículos.</p>
      ) : (
        //Here I map through the vehicles and display a VehicleCard for each one
        <div className="vehicles-grid">
            {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
        </div>
      )}
    </div>
  );
}

//Export the component
export default Vehicles;