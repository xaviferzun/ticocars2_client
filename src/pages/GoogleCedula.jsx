import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {validateCedulaGoogle} from "../services/authService";

//KAN-73 Page to validate cedula for new Google users
function GoogleCedula() {
  const navigate = useNavigate();
  const [cedula, setCedula] = useState("");
  const [padronInfo, setPadronInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //Get token from URL and save it for authenticated requests
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  //Validate cedula against the padron when field loses focus
  const handleCedulaBlur = async () => {
    if (cedula.length !== 9) return;
    try {
      setLoading(true);
      const { validateCedula } = await import("../services/authService");
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

  //Submit cedula to activate the Google account
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!padronInfo) {
      setMessage("Debes validar tu cédula primero.");
      return;
    }
    try {
      setLoading(true);
      await validateCedulaGoogle(cedula);
      navigate("/vehicles");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  //pendiente pa mañana crear estructura de la pagina
  return (
    <div className="auth-page">
      <div className="card">
      </div>
    </div>
  );
}

export default GoogleCedula;