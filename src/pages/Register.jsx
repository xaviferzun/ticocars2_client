import {useState} from "react";
import {registerUser} from "../services/authService";

//Component for user registration
function Register() {
  const [userInput, setUserInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  //Variable to show messages to the user
  const [message, setMessage] = useState("");

  //Function to handle form changes and update the state
  const handleChange = (e) => {
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  };

  //Function to handle form submission and call the registerUser service
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(userInput);
      setMessage(result.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  //Here I return a simple form for user registration with fields for username, email, and password.
  return (
    <div>
      <h2>TicoCars - Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={userInput.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userInput.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={userInput.password}
          onChange={handleChange}
        />
        <button type="submit">Registrarse</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

//Export the Register component to be used in all app
export default Register;