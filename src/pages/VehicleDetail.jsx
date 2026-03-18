import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {getVehicleById} from "../services/vehicleService";
import {createQuestion} from "../services/questionService";
import {getUserQuestions} from "../services/questionService";
import "../VehicleDetail.css";

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
  const [hasPendingQuestion, setHasPendingQuestion] = useState(false);

  //Hook to fetch vehicle data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleData = await getVehicleById(id);
        setVehicle(vehicleData);
        const token = localStorage.getItem("token"); //Check authenticated
        if (token) {
          const userQuestions = await getUserQuestions();
 
          //Check if user has already asked a question about this vehicle
          const exists = userQuestions.find(
            (q) => q.vehicle?._id === id && !q.answer
          );
          setHasPendingQuestion(!!exists);
          
        }
      } catch (error) {
        setError(error.message || "Error al cargar el vehículo");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
  //KAN-43 Copy vehicle URL 
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setMessage("Enlace copiado al portapapeles");
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
      <button onClick={handleShare}>Compartir vehículo</button>  
        {/*Fornulario de pregunta*/}
        {!hasPendingQuestion ? (
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
        ) : (
        <p style={{ marginTop: "20px" }}>
            Ya tienes una conversación activa sobre este vehículo. Ve a tu inbox.
        </p>
        )}
    </div>
  );
};

export default VehicleDetail;