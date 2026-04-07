import { useState } from "react";
import { registerUser, validateCedula } from "../services/authService";

//Component for user registration with cedula validation
function Register() {
  const [userInput, setUserInput] = useState({
    username: "",
    email: "",
    password: "",
    cedula: "",
  });

  //State to show the name autocompleted from the padron
  const [padronInfo, setPadronInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  //Function to handle form changes and update the state
  const handleChange = (e) => {
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });

    //Reset padron info if cedula field changes
    if (e.target.name === "cedula") {
      setPadronInfo(null);
    }
  };

  //Validate cedula against the padron when the field loses focus
  const handleCedulaBlur = async () => {
    const { cedula } = userInput;

    if (cedula.length !== 9) return;

    try {
      setLoading(true);
      const result = await validateCedula(cedula);
      setPadronInfo(result);
      setMessage("");
    } catch (error) {
      setPadronInfo(null);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  //Function to handle form submission and call the registerUser service
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!padronInfo) {
      setMessage("Debes validar tu cédula antes de registrarte.");
      return;
    }

    try {
      setLoading(true);
      const result = await registerUser(userInput);
      setMessage(result.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  //Here I return a form for user registration with fields for cedula, username, email, and password
  return (
    <div className="auth-page">
      <div className="card">
        <h2>TicoCars — Registro</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="cedula"
            placeholder="Número de cédula (9 dígitos)"
            value={userInput.cedula}
            onChange={handleChange}
            onBlur={handleCedulaBlur}
            maxLength={9}
          />

          {/* Show autocompleted name from padron */}
          {padronInfo && (
            <div className="padron-info">
              <p>✓ Cédula válida: {padronInfo.nombre} {padronInfo.apellidoPaterno} {padronInfo.apellidoMaterno}</p>
            </div>
          )}

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
          <button type="submit" disabled={loading}>
            {loading ? "Procesando..." : "Registrarse"}
          </button>
        </form>
        <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

//Export the Register component to be used in all app
export default Register;