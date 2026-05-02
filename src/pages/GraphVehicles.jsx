import {useEffect, useState} from "react";
import {queryVehicles} from "../services/graphqlService";

//KAN-69 Page to show vehicles fetched from the graph api
function GraphVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await queryVehicles();
        setVehicles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  //KAN-69 Show the list or message if no found vehicles
  return (
    <div style={{ padding: "32px" }}>
      <h2>Vehículos</h2>
      {vehicles.length === 0 ? (
        <p>No se encontraron vehículos.</p>
      ) : (
        <ul>
          {vehicles.map((v) => (
            <li key={v.id}>
              <strong>{v.brand} {v.model}</strong> — {v.year} — ${v.price} — {v.status}
              {v.owner && <span> — Publicado por: {v.owner.username}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GraphVehicles;