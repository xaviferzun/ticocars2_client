import { useNavigate } from "react-router-dom"; //Importing necessary components and hooks for the VehicleCard component

//Component to display a card with the vehicle information
function VehicleCard({ vehicle }) {
  const navigate = useNavigate();

  //Navigate to detail page
  const handleViewDetail = () => {
    navigate(`/vehicles/${vehicle._id}`);
  };
  return (
    <div className="vehicle-card">
      <h3>
        {vehicle.brand} {vehicle.model}
      </h3>
      <p>Año: {vehicle.year}</p>
      <p>Precio: ${vehicle.price}</p>
      <p>Estado: {vehicle.status}</p>
      <button onClick={handleViewDetail}>
        Ver detalle
      </button>
    </div>
  );
}

export default VehicleCard;