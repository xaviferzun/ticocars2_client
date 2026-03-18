import axios from "axios";
const API_URL = "http://localhost:3000/api/questions";

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

//Create new question
export const createQuestion = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    "http://localhost:3000/api/questions",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

//KAN-43 Answer a question
export const answerQuestion = async (questionId, text) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    "http://localhost:3000/api/answers",
    { questionId, text },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.answer; 
};

//Get questions made by logged user
export const getUserQuestions = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    "http://localhost:3000/api/questions/user",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getInbox = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/api/questions/inbox",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}; 