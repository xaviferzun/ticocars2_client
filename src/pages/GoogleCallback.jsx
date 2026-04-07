import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//Component to handle the Google OAuth2 callback and save the token
function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    //Get the token from the URL query params
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      //Save the token in localStorage and redirect to vehicles
      localStorage.setItem("token", token);
      navigate("/vehicles");
    } else {
      //If no token redirect to login
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="auth-page">
      <div className="card">
        <p>Iniciando sesión con Google...</p>
      </div>
    </div>
  );
}

export default GoogleCallback;