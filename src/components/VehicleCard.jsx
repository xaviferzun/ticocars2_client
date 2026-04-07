import { useNavigate } from "react-router-dom";
import "../VehicleCard.css";
const API_BASE = "http://localhost:3000";

function VehicleCard({ vehicle }) {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/vehicles/${vehicle._id}`);
  };

  return (
    <div className="vehicle-card">
      {vehicle.images && vehicle.images.length > 0 ? (
        <img
          src={`${API_BASE}${vehicle.images[0]}`}
          alt={`${vehicle.brand} ${vehicle.model}`}
          style={{ width: "100%", height: "180px", objectFit: "cover" }}
        />
      ) : (
        <div className="vehicle-card-no-image">🚗</div>
      )}

      <div className="vehicle-card-body">
        <h3 className="vehicle-card-title">{vehicle.brand} {vehicle.model}</h3>
        <p className="vehicle-card-year">Año: {vehicle.year}</p>
        <p className="vehicle-card-price">Precio: ${vehicle.price}</p>
        <span className={`vehicle-card-status ${vehicle.status === "available" ? "status-available" : "status-sold"}`}>
          {vehicle.status === "available" ? "Disponible" : "Vendido"}
        </span>
        <button className="vehicle-card-btn" onClick={handleViewDetail}>Ver detalle</button>
      </div>
    </div>
  );
}

export default VehicleCard;