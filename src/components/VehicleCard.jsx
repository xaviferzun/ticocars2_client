import { useNavigate } from "react-router-dom";
import "../VehicleCard.css";
const API_BASE = "http://localhost:3000";

//Component to display a card with the vehicle information
function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  //Navigate to detail page
  const handleViewDetail = () => {
    navigate(`/vehicles/${vehicle._id}`);
  };
  return (
    <div className="vehicle-card">
      {/*KAN-43 Show vehicle image if available */}
      {vehicle.images && vehicle.images.length > 0 && (
        <img
          src={`${API_BASE}${vehicle.images[0]}`}
          alt={`${vehicle.brand} ${vehicle.model}`}
          style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
        />
      )}

      <h3>{vehicle.brand} {vehicle.model}</h3>
      <p>Año: {vehicle.year}</p>
      <p>Precio: ${vehicle.price}</p>
      <p>Estado: {vehicle.status}</p>
      <button onClick={handleViewDetail}>Ver detalle</button>
    </div>
  );
}
export default VehicleCard;