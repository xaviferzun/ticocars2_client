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


  //pendiente handle para validar cedula contra el padron
  //pendiente submit para actuvar la cuenta

  //pendiente pa mañana crear estructura de la pagina





}