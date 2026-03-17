import axios from "axios";
const API_URL = "http://localhost:3000/api/vehicles";

//Function to get all vehicles from the API
export const getVehicles = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};