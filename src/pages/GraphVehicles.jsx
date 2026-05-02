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

  //retun continuar mañana


}