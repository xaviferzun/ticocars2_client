import axios from "axios";
const API_URL = "http://localhost:5000/api/questions";

//KAN-43 Get questions for owner vehicles
export const getOwnerQuestions = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/owner`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//KAN-43 Answer a question
export const answerQuestion = async (questionId, text) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/${questionId}/answer`,
    { text },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};