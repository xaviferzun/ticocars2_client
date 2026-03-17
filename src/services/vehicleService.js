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

//Function to get vehicles of the authenticated user
export const getMyVehicles = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/mine`, {
    headers: {
      Authorization: `Bearer ${token}`, //send token
    },
  });
  return response.data;
};


//KAN-42 Get token from localStorage
const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

//KAN-42 CREATE vehicle
export const createVehicle = async (data) => {
  const response = await axios.post(API_URL, data, getAuthConfig());
  return response.data;
};

//KAN-42 DELETE vehicle
export const deleteVehicle = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};

//KAN-42 PATCH mark as sold
export const markAsSold = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}/sold`,
    {},
    getAuthConfig()
  );
  return response.data;
};

//KAN-42 UPDATE vehicle
export const updateVehicle = async (id, data) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    data,
    getAuthConfig()
  );
  return response.data;
};