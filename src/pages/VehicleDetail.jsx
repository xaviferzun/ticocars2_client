import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {getVehicleById} from "../services/vehicleService";
import {createQuestion} from "../services/questionService";

//Component to display the details of a specific vehicle
const VehicleDetail = () => {
  const {id} = useParams(); //Get ID from API
  const navigate = useNavigate(); //Hook to navigate between pages
  const [vehicle, setVehicle] = useState(null); //Store vehicle data
  const [loading, setLoading] = useState(true); //Loading state
  const [error, setError] = useState(""); //Error state
  //State for question input
  const [questionText, setQuestionText] = useState("");
  const [message, setMessage] = useState(null);

  //Hook to fetch vehicle data when the component mounts
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await getVehicleById(id);
        setVehicle(data);
      } catch (error) {
        setError(error.message || "Error al cargar el vehículo");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  //Handle question submission
  const handleSubmitQuestion = async () => {
    const token = localStorage.getItem("token");

    //If user is not authenticated → redirect
    if (!token) {
      navigate("/login");
      return;
    }

    //Validate input
    if (!questionText.trim()) {
      setMessage("La pregunta no puede estar vacía");
      return;
    }

    try {
      await createQuestion({
        vehicleId: vehicle._id,
        text: questionText,
      });

      //Clear input
      setQuestionText("");

      //Success message
      setMessage("Pregunta enviada correctamente");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Error al enviar la pregunta"
      );
    }
  };

  //Go back
  const handleBack = () => {
    navigate("/vehicles");
  };

  //Warnings
  if (loading) {
    return <h2>Cargando...</h2>;
  }
  if (error) {
    return <h2>{error}</h2>;
  }
  if (!vehicle) {
    return <h2>Vehículo no encontrado</h2>;
  }

  return (
    <div>
      <h1>Detalle del Vehículo</h1>
      <p><strong>Marca:</strong> {vehicle.brand}</p>
      <p><strong>Modelo:</strong> {vehicle.model}</p>
      <p><strong>Año:</strong> {vehicle.year}</p>
      <p><strong>Precio:</strong> ${vehicle.price}</p>
      <p><strong>Estado:</strong> {vehicle.status}</p>

      <button onClick={handleBack}>Volver a la lista</button>
      {/*Question Section*/}
      <div style={{ marginTop: "20px" }}>
        <h3>Escribe tu pregunta</h3>

        <textarea
          placeholder="Escribe tu pregunta sobre este vehículo..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />

        <br />

        <button onClick={handleSubmitQuestion}>
          Enviar pregunta
        </button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default VehicleDetail;