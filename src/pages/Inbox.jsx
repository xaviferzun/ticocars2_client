import {useEffect, useState} from "react";
import {getOwnerQuestions, answerQuestion} from "../services/questionService";

//KAN-43 Inbox page for owner questions
function Inbox() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({}); //store input values per question

  //Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getOwnerQuestions();
        setQuestions(data);
      } catch (err) {
        setError("Error al cargar las preguntas");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  //Handle input change
  const handleInputChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  //Handle answer submission
  const handleAnswer = async (questionId) => {
    const text = answers[questionId];
    if (!text) return;
    try {
      const updatedQuestion = await answerQuestion(questionId, text);

      //Update UI with the new answer
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === questionId ? updatedQuestion : q
        )
      );
      //Clear
      setAnswers((prev) => ({
        ...prev,
        [questionId]: "",
      }));
    } catch (err) {
      alert("Error al responder la pregunta");
    }
  };
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="inbox-container">
      <h2>Inbox</h2>
      {questions.length === 0 && <p>No hay preguntas</p>}
      {questions.map((q) => (
        <div key={q._id} className="inbox-card">
          {/*Vehicle info*/}
          <h3>
            {q.vehicle?.brand} {q.vehicle?.model}
          </h3>
          {/*User*/}
          <p>
            <strong>Usuario:</strong> {q.user?.email}
          </p>

          {/*Question*/}
          <p>
            <strong>Pregunta:</strong> {q.text}
          </p>

          {/*Answer section*/}
          {q.answer ? (
            <p>
              <strong>Respuesta:</strong> {q.answer}
            </p>
          ) : (
            <div>
              <textarea
                placeholder="Escribe tu respuesta..."
                value={answers[q._id] || ""}
                onChange={(e) =>
                  handleInputChange(q._id, e.target.value)
                }
              />
               <button
                  disabled={!answers[q._id]}
                  onClick={() => handleAnswer(q._id)}>
                  Responder
               </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Inbox;