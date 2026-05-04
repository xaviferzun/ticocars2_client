import {useEffect, useState} from "react";
import {queryVehicles} from "../services/graphqlService";
import VehicleCard from "../components/VehicleCard";

//Component to display the list of vehicles
function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //KAN-33 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //KAN-32 Filter states
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [status, setStatus] = useState("");

  //KAN-32 State for debounced filters
  const [filters, setFilters] = useState({});

  //Debounce-  wait before applying filters
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters({
        brand,
        model,
        priceMin,
        priceMax,
        yearMin,
        yearMax,
        status,
      });
      setCurrentPage(1); //Reset to first page when filters change
    }, 500);

    return () => clearTimeout(timeout);
  }, [brand, model, priceMin, priceMax, yearMin, yearMax, status]);

  //Fetch vehicles when filters change
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        //bKAN-74 Use GraphQL instead of REST for vehicle queries
        const results = await queryVehicles({
          brand: filters.brand,
          model: filters.model,
          status: filters.status,
        });
        setVehicles(results);
        setTotalPages(1);
      } catch (error) {
        setError("Error al cargar los vehículos");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [filters, currentPage]);

  //Warnings
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-container">
      <h1 style={{ color: "#0f172a", marginBottom: "24px" }}>
        Encuentra tu próximo vehículo
      </h1>

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
            <VehicleCard key={vehicle.id} vehicle={vehicle}/>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}>
          Anterior
        </button>

        {/* Page numbers */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            style={{
              fontWeight: currentPage === index + 1 ? "bold" : "normal",
            }}>
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Vehicles;