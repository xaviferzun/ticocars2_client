
import {useEffect,useState} from "react";
import {useSearchParams} from "react-router-dom";
import {activateAccount} from "../services/authService";

//KAN-62 Page to activate a user account withj email token
function Activate(){
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message,setMessage] = useState("Activando tu cuenta...");
  const [success,setSuccess] = useState(false);

  //KAN-62 Call the activation endpoint when the page load
  useEffect(() => {
    const activate = async () => {
      try {
        const data = await activateAccount(token);
        setMessage(data.message);
        setSuccess(true);
      } catch (error) {
        setMessage(error.message );
        setSuccess(false);
      }
    };
    if (token) {
      activate();
    } else {
      setMessage("Token de activación no encontrado.");
    }
  }, [token]);

  return (
    <div className="auth-page">
      <div className="card">
        <h2>Activación de cuenta </h2>
        <p>{message}</p>
        {success && <a href="/login">Iniciar sesión </a>}
      </div>
    </div>
  );
}
export default Activate;