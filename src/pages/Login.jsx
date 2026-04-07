import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {loginUser} from "../services/authService";

//Here I create a simple login form that allows users to enter their email and password.
function Login() {
  const navigate = useNavigate(); //KAN-41 Hook to navigate to other pages after successful login
  const [userInput, setUserInput] = useState({
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

  //Function to handle form submission and call the loginUser service
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser(userInput);

      //Save token in localStorage for future authenticated requests
      localStorage.setItem("token", result.token);
      setMessage("Ingreso existoso (Token guardado)");
      //Navigate to the vehicles page
      navigate("/vehicles");
    } catch (error) {
      setMessage(error.message);
    }
  };

  //Redirect to backend to start the Google OAuth2 flow
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  //Here I return a simple form for user login with fields for email and password.
  return (
    <div className="auth-page">
      <div className="card">
        <h2>TicoCars — Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email"
            value={userInput.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Contraseña"
            value={userInput.password} onChange={handleChange} />
          <button type="submit">Iniciar sesión</button>
        </form>

        {/*KAN-59 Google OAuth2 login button */}
        <div className="divider">
          <span>o</span>
        </div>
        <button className="google-btn" onClick={handleGoogleLogin}>
          Continuar con Google
        </button>

        <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

//Export the login to use it on the app
export default Login;