import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getMyVehicles, deleteVehicle, markAsSold, updateVehicle, createVehicle} from "../services/vehicleService";
import {queryMyVehicles} from "../services/graphqlService";
import "../MyVehicles.css";

const API_BASE = "http://localhost:3000";

function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyVehicles = async () => {
      setLoading(true);
      try {
        const data = await queryMyVehicles();
        const mapped = data.map(v => ({...v, _id: v.id})); //KAN-74 Map graph id to _id for compatibility with current behavir
        setVehicles(mapped);
      } catch (error) {
        setError("Error al cargar tus vehículos");
      } finally {
        setLoading(false);
      }
    };
    fetchMyVehicles();
  }, []);

  const handleEdit = (vehicle) => {
    setEditingVehicleId(vehicle._id);
    setEditForm({ brand: vehicle.brand, model: vehicle.model, price: vehicle.price, year: vehicle.year });
  };

  const handleCreate = async () => {
    try {
      const newVehicle = await createVehicle(editForm, imageFile);
      setVehicles((prev) => [newVehicle, ...prev]);
      setEditForm({});
      setImageFile(null);
      setIsCreating(false);
    } catch (err) {
      setError("Error al crear vehículo");
    }
  };

  const handleMarkAsSold = async (id) => {
    try {
      await markAsSold(id);
      setVehicles((prev) => prev.map((v) => v._id === id ? {...v, status: "sold"} : v));
    } catch (err) {
      setError("Error al marcar como vendido");
    }
  };

  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este vehículo?")) return;
    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      setError("Error al eliminar vehículo");
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setEditForm((prev) => ({...prev, [name]: value}));
  };

  const handleSave = async (id) => {
    try {
      await updateVehicle(id, editForm, imageFile);
      setVehicles((prev) => prev.map((v) => v._id === id ? {...v, ...editForm} : v));
      setEditingVehicleId(null);
      setImageFile(null);
    } catch (err) {
      setError("Error al actualizar vehículo");
    }
  };

  const handleCancel = () => { setEditingVehicleId(null); setEditForm({}); };

  if (loading) return <p className="my-vehicles-empty">Cargando...</p>;
  if (error)   return <p className="my-vehicles-empty">{error}</p>;

  return (
    <div className="my-vehicles-container">
      <h1 className="my-vehicles-title">Mis Vehículos</h1>

      <button className="btn-add-vehicle" onClick={() => setIsCreating(true)}>
        + Agregar vehículo
      </button>

      {/* Formulario de creación */}
      {isCreating && (
        <div className="my-vehicle-form-card">
          <input name="brand" placeholder="Marca" onChange={handleChange} />
          <input name="model" placeholder="Modelo" onChange={handleChange} />
          <input name="price" type="number" placeholder="Precio" onChange={handleChange} />
          <input name="year" type="number" placeholder="Año" onChange={handleChange} />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <div className="form-actions">
            <button className="btn-save" onClick={handleCreate}>Crear</button>
            <button className="btn-cancel" onClick={() => setIsCreating(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {vehicles.length === 0 ? (
        <p className="my-vehicles-empty">No tienes vehículos registrados.</p>
      ) : (
        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="vehicle-card">

              {/* Imagen */}
              {vehicle.images && vehicle.images.length > 0 && (
                <img
                  src={`${API_BASE}${vehicle.images[0]}`}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
              )}

              {editingVehicleId === vehicle._id ? (
                /* Formulario de edición */
                <div className="my-vehicle-form-card" style={{margin: "12px", boxShadow: "none"}}>
                  <input name="brand" value={editForm.brand} onChange={handleChange} />
                  <input name="model" value={editForm.model} onChange={handleChange} />
                  <input name="price" value={editForm.price} onChange={handleChange} type="number" />
                  <input name="year" value={editForm.year} onChange={handleChange} type="number" />
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  <div className="form-actions">
                    <button className="btn-save" onClick={() => handleSave(vehicle._id)}>Guardar</button>
                    <button className="btn-cancel" onClick={handleCancel}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Info del vehículo */}
                  <div className="my-vehicle-card-body">
                    <h3 className="my-vehicle-card-title">{vehicle.brand} {vehicle.model}</h3>
                    <p className="my-vehicle-card-price">$ {vehicle.price}</p>
                    <p className="my-vehicle-card-info">Año: {vehicle.year}</p>
                    <span className={`my-vehicle-card-status ${vehicle.status === "available" ? "status-available" : "status-sold"}`}>
                      {vehicle.status === "available" ? "Disponible" : "Vendido"}
                    </span>
                  </div>

                  {/* Botones de acción */}
                  <div className="my-vehicle-actions">
                    <button className="btn-edit" onClick={() => handleEdit(vehicle)}>Editar</button>
                    <button className="btn-sold" onClick={() => handleMarkAsSold(vehicle._id)}>Marcar como vendido</button>
                    <button className="btn-delete" onClick={() => handleDelete(vehicle._id)}>Eliminar</button>
                    <button className="btn-messages" onClick={() => navigate("/inbox")}>Ver mensajes</button>
                  </div>
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