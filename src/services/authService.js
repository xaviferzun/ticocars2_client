const API_URL = "http://localhost:3000/api/auth";

//Function to validate a cedula against the padron API through our backend
export const validateCedula = async (cedula) => {
  const response = await fetch(`${API_URL}/validate-cedula?cedula=${cedula}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al validar la cédula");
  }

  return data;
};

//Function to register a new user
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  //Validate the response and return the data or show an error
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Fallo al registrar el usuario");
  }

  return data;
};

//Function to login a user
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  //Validate the response and return the data or show an error
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Fallo al iniciar sesión");
  }

  return data;
};

//KAN-62 Function to activate a user account via email token
export const activateAccount = async(token)=>{
  const response = await fetch(`${API_URL}/activate?token=${token}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al activar la cuenta");
  }
  return data;
};