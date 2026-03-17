import axios from "axios";
const API_URL = "http://localhost:3000/api/vehicles";

//Function to get all vehicles from the API
export const getVehicles = async (filters = {}, page = 1) => {
  const response = await axios.get(API_URL, {
    params: {
      ...filters, //Spread filters as query parameters
      page, //Add pagination parameter       
    },
  });

  return response.data;
};

//Function to get a vehicle by ID from the API
export const getVehicleById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: "Error al obtener el vehículo"};
  }
};