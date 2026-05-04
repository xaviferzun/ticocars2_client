import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {answerQuestion} from "../services/questionService";
import {queryInbox} from "../services/graphqlService"; //KAN-74 Graphql for inbox data
import "../Inbox.css";

//KAN-43 Decode JWT to get current user id 
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
};

//KAN-43 Inbox page shows all conversations for the authenticated user
function Inbox() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const currentUserId = getUserIdFromToken();

  //KAN-43 Load inbox on mount
  useEffect(() => {
    const loadInbox = async () => {
      try {
        const data = await queryInbox();
        setConversations(data);
      } catch (err) {
        setError("Error al cargar las conversaciones");
      } finally {
        setLoading(false);
      }
    };
    loadInbox();
  }, []);

  //KAN-43 Track reply text per conversation using question id as key
  const handleReplyChange = (questionId, value) => {
    setReplyText((prev) => ({ ...prev, [questionId]: value }));
  };

  //KAN-43 Handle answer submission
  const handleAnswer = async (questionId) => {
    const text = replyText[questionId];
    if (!text || !text.trim()) return;

    setSubmitting(true);
    try {
      await answerQuestion(questionId, text);

      //Reload inbox to show new answer
      const updated = await queryInbox();
      setConversations(updated);

      //Clear reply input for this question
      setReplyText((prev) => ({ ...prev, [questionId]: "" }));
    } catch (err) {
      alert("Error al enviar la respuesta");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="inbox-empty">Cargando conversaciones...</p>;
  if (error) return <p className="inbox-empty">{error}</p>;

  return (
    <div className="inbox-container">
      <h2 className="inbox-title">Bandeja de entrada</h2>

      {conversations.length === 0 && (
        <p className="inbox-empty">No tienes conversaciones aún.</p>
      )}

      {/*KAN-43 Render one card per conversation */}
      {conversations.map((conv) => {

        //KAN-43 Determine if current user is the vehicle owner
        const isOwner = conv.vehicle?.owner?.id === currentUserId;

        return (
          <div key={conv.id} className="inbox-card">

            {/*Card header — vehicle name and role badge */}
            <div className="inbox-card-header">
              <span
                className="inbox-vehicle-name"
                onClick={() => navigate(`/vehicles/${conv.vehicle?.id}`)}
              >
                {conv.vehicle?.brand} {conv.vehicle?.model} {conv.vehicle?.year}
              </span>
              <span className={isOwner ? "badge-owner" : "badge-asker"}>
                {isOwner ? "Dueño" : "Interesado"}
              </span>
            </div>

            {/*Question block */}
            <div className="inbox-question-block">
              <p className="inbox-block-label">
                Pregunta de: {conv.user?.username}
              </p>
              <p className="inbox-block-text">{conv.text}</p>
              <p className="inbox-block-date">
                {conv.createdAt ? new Date(parseInt(conv.createdAt)).toLocaleDateString("es-CR") : ""}
              </p>
            </div>

            {/*Answer block — visible to both users if answer exists */}
            {conv.answer && (
              <div className="inbox-answer-block">
                <p className="inbox-block-label">
                  Respuesta de: {conv.answer.user?.username}
                </p>
                <p className="inbox-block-text">{conv.answer.text}</p>
                <p className="inbox-block-date">
                  {conv.answer.createdAt ? new Date(parseInt(conv.answer.createdAt)).toLocaleDateString("es-CR") : ""}
                </p>
              </div>
            )}

            {/*Reply form — only for owner, only if not answered yet */}
            {isOwner && !conv.answer && (
              <div className="inbox-reply-box">
                <textarea
                  className="inbox-textarea"
                  placeholder="Escribe tu respuesta..."
                  rows={3}
                  value={replyText[conv.id] || ""}
                  onChange={(e) => handleReplyChange(conv.id, e.target.value)}
                />
                <button
                  className="inbox-send-btn"
                  onClick={() => handleAnswer(conv.id)}
                  disabled={submitting || !replyText[conv.id]?.trim()}
                >
                  {submitting ? "Enviando..." : "Responder"}
                </button>
              </div>
            )}

            {/*Closed note — shown to everyone once the conversation is answered */}
            {conv.answer && (
              <p className="inbox-closed-note">
                Conversación finalizada.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Inbox;