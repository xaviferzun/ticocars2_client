import {useEffect, useState } from "react";
import {getMyVehicles, deleteVehicle, markAsSold, updateVehicle, createVehicle} from "../services/vehicleService";

//KAN-42 Component to display user vehicles
function MyVehicles() {
const [vehicles, setVehicles] = useState([]);
const [isCreating, setIsCreating] = useState(false);
const [editingVehicleId, setEditingVehicleId] = useState(null);
const [editForm, setEditForm] = useState({});
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

  //Fetch user vehicles on mount
  useEffect(() => {
    const fetchMyVehicles = async () => {
      setLoading(true);
      try {
        const data = await getMyVehicles();
        setVehicles(data);
      } catch (error) {
        setError("Error al cargar tus vehículos");
      } finally {
        setLoading(false);
      }
    };

    fetchMyVehicles();
  }, []);

  //KAN-42 Handlers for actions
  const handleEdit = (vehicle) => {
    setEditingVehicleId(vehicle._id);
    setEditForm({
      brand: vehicle.brand,
      model: vehicle.model,
      price: vehicle.price,
      year: vehicle.year,
    });
  };

  //KAN-42 CREATE vehicle
  const handleCreate = async () => {
    try {
      const newVehicle = await createVehicle(editForm);
      setVehicles((prev) => [newVehicle, ...prev]);
      setEditForm({});
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      setError("Error al crear vehículo");
    }
  };

  //KAN-42 Mark as sold
  const handleMarkAsSold = async (id) => {
    try {
      const updated = await markAsSold(id);

      setVehicles((prev) =>
        prev.map((v) =>
          v._id === id ? { ...v, status: "sold" } : v
        )
    );
  } catch (err) {
      console.error(err);
      setError("Error al marcar como vendido");
  }
  };

  //KAN-42 Delete vehicle
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar este vehículo?");
    if (!confirmDelete) return;
    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error(err);
      setError("Error al eliminar vehículo");
    }
  };

  //KAN-42 Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //KAN-42 Save edited vehicle
  const handleSave = async (id) => {
    try {
      const updated = await updateVehicle(id, editForm);

      setVehicles((prev) =>
        prev.map((v) =>
          v._id === id ? { ...v, ...editForm } : v
        )
      );

      setEditingVehicleId(null);
    } catch (err) {
      console.error(err);
      setError("Error al actualizar vehículo");
    }
  };

  //KAN-42 Cancel edit
  const handleCancel = () => {
    setEditingVehicleId(null);
    setEditForm({});
  };

  //States
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Mis Vehículos</h1>

      {/* BOTÓN CREAR */}
      <button onClick={() => setIsCreating(true)}>
        + Agregar vehículo
      </button>

      {/* FORM CREAR */}
      {isCreating && (
        <div className="vehicle-card">
          <input name="brand" placeholder="Marca" onChange={handleChange} />
          <input name="model" placeholder="Modelo" onChange={handleChange} />
          <input name="price" type="number" placeholder="Precio" onChange={handleChange} />
          <input name="year" type="number" placeholder="Año" onChange={handleChange} />

          <button onClick={handleCreate}>Crear</button>
          <button onClick={() => setIsCreating(false)}>Cancelar</button>
        </div>
      )}

      {vehicles.length === 0 ? (
        <p>No tienes vehículos registrados.</p>
      ) : (
        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="vehicle-card">

              {editingVehicleId === vehicle._id ? (
                <>
                  <input name="brand" value={editForm.brand} onChange={handleChange} />
                  <input name="model" value={editForm.model} onChange={handleChange} />
                  <input name="price" value={editForm.price} onChange={handleChange} type="number" />
                  <input name="year" value={editForm.year} onChange={handleChange} type="number" />

                  <button onClick={() => handleSave(vehicle._id)}>Guardar</button>
                  <button onClick={handleCancel}>Cancelar</button>
                </>
              ) : (
                <>
                  <h3>{vehicle.brand} {vehicle.model}</h3>
                  <p>Precio: ${vehicle.price}</p>
                  <p>Año: {vehicle.year}</p>
                  <p>Estado: {vehicle.status}</p>

                  <button onClick={() => handleEdit(vehicle)}>Editar</button>
                  <button onClick={() => handleMarkAsSold(vehicle._id)}>Marcar como vendido</button>
                  <button onClick={() => handleDelete(vehicle._id)}>Eliminar</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyVehicles;