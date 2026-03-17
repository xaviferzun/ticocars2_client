//Component to display a card with the vehicle information
function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      <h3>
        {vehicle.brand} {vehicle.model}
      </h3>
      <p>Año: {vehicle.year}</p>
      <p>Precio: ${vehicle.price}</p>
      <p>Estado: {vehicle.status}</p>
      <button>Ver detalle</button>
    </div>
  );
}
export default VehicleCard;