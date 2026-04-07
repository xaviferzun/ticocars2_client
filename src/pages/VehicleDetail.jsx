import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {getVehicleById} from "../services/vehicleService";
import {createQuestion} from "../services/questionService";
import {getUserQuestions} from "../services/questionService";
import "../VehicleDetail.css";

const API_BASE = "http://localhost:3000";

const VehicleDetail = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [message, setMessage] = useState(null);
  const [hasPendingQuestion, setHasPendingQuestion] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleData = await getVehicleById(id);
        setVehicle(vehicleData);
        const token = localStorage.getItem("token");
        if (token) {
          const userQuestions = await getUserQuestions();
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

  const handleSubmitQuestion = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    if (!questionText.trim()) { setMessage("La pregunta no puede estar vacía"); return; }
    try {
      await createQuestion({ vehicleId: vehicle._id, text: questionText });
      setQuestionText("");
      setMessage("Pregunta enviada correctamente");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error al enviar la pregunta");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setMessage("Enlace copiado al portapapeles");
  };

  const handleBack = () => navigate("/vehicles");

  if (loading) return <h2>Cargando...</h2>;
  if (error)   return <h2>{error}</h2>;
  if (!vehicle) return <h2>Vehículo no encontrado</h2>;

  return (
    <div className="detail-container">

      {/* Imagen del vehículo */}
      {vehicle.images && vehicle.images.length > 0 && (
        <img
          className="detail-image"
          src={`${API_BASE}${vehicle.images[0]}`}
          alt={`${vehicle.brand} ${vehicle.model}`}
        />
      )}

      {/* Botones de acción */}
      <div className="detail-actions">
        <button className="btn-back" onClick={handleBack}>← Volver a la lista</button>
        <button className="btn-share" onClick={handleShare}>Compartir vehículo</button>
      </div>

      {/* Tarjeta de información */}
      <div className="detail-card">
        <h2 className="detail-title">{vehicle.brand} {vehicle.model}</h2>

        <div className="detail-row">
          <span className="detail-label">Año</span>
          <span className="detail-value">{vehicle.year}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Precio</span>
          <span className="detail-value detail-price">${vehicle.price}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Estado</span>
          <span className="detail-value">
            {vehicle.status === "available" ? "Disponible" : "Vendido"}
          </span>
        </div>
          {vehicle.owner?.username && (
          <div className="detail-row">
            <span className="detail-label">Publicado por</span>
            <span className="detail-value">{vehicle.owner.username}</span>
          </div>
        )}
      </div>

      {/* Sección de pregunta */}
      {!hasPendingQuestion ? (
        <div className="detail-question-section">
          <h3>Escribe tu pregunta</h3>
          <textarea
            placeholder="Escribe tu pregunta sobre este vehículo..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={4}
          />
          <button className="btn-send-question" onClick={handleSubmitQuestion}>
            Enviar pregunta
          </button>
          {message && <p className="detail-message">{message}</p>}
        </div>
      ) : (
        <p className="detail-pending-note">
          Ya tienes una conversación activa sobre este vehículo. Ve a tu inbox.
        </p>
      )}

    </div>
  );
};

export default VehicleDetail;