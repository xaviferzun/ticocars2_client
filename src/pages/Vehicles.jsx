import {useEffect, useState} from "react";
import {getVehicles} from "../services/vehicleService";
import VehicleCard from "../components/VehicleCard";

//Component to display the list of vehicles
function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //KAN-32 Filter states
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [status, setStatus] = useState("");

  //KAN-32 Function to fetch vehicles with filters
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const filters = {
        brand,
        model,
        priceMin,
        priceMax,
        yearMin,
        yearMax,
        status,
      };

      const data = await getVehicles(filters);
      setVehicles(data.results);
    } catch (error) {
      setError("Error al cargar los vehículos");
    } finally {
      setLoading(false);
    }
  };

  //KAN-32 Hook to fetch vehicles when filters change
  useEffect(() => {
    fetchVehicles();
  }, [brand, model, priceMin, priceMax, yearMin, yearMax, status]);
  //Warnings
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div>
      <h1>Lista de Vehículos</h1>
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Marca"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        
        <input
          type="text"
          placeholder="Modelo"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <input
          type="number"
          placeholder="Precio mínimo"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
        />

        <input
          type="number"
          placeholder="Precio máximo"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
        />

        <input
          type="number"
          placeholder="Año mínimo"
          value={yearMin}
          onChange={(e) => setYearMin(e.target.value)}
        />

        <input
          type="number"
          placeholder="Año máximo"
          value={yearMax}
          onChange={(e) => setYearMax(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="available">Disponible</option>
          <option value="sold">Vendido</option>
        </select>
      </div>

      {/* Vehicles */}
      {vehicles.length === 0 ? (
        <p>No se encontraron vehículos.</p>
      ) : (
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