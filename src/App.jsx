import {useState} from "react";
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import MyVehicles from "./pages/MyVehicles";
import GraphVehicles from "./pages/GraphVehicles";
import Inbox from "./pages/Inbox";
import GoogleCallback from "./pages/GoogleCallback";
import GoogleCedula from "./pages/GoogleCedula";
import "./App.css";
import CheckEmail from "./pages/CheckEmail";
import Activate from "./pages/Activate";

//Navbar component
function Navbar({onOpenInbox}) {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/vehicles");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2>TicoCars</h2>
      </div>
      <div className="nav-right">
        <Link to="/vehicles">Vehículos</Link>

        <Link to={isAuthenticated ? "/my-vehicles" : "/login"}>
          Mis Vehículos
        </Link>

        {/*KAN-43 Open inbox drawer — only when authenticated */}
        {isAuthenticated && (
          <button onClick={onOpenInbox}>Inbox</button>
        )}

        {isAuthenticated ? (
          <>
            {/*KAN-62 Username button logs out on cliclk*/}
            <button onClick={handleLogout}>
              {username ? username : "Mi cuenta"} — Cerrar sesión </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  //KAN-43 Inbox drawer state
  const [inboxOpen, setInboxOpen] = useState(false);

  return (
    <Router>
      <Navbar onOpenInbox={() => setInboxOpen(true)} />

      <Routes>
        <Route path="/" element={<Vehicles/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/vehicles" element={<Vehicles/>} />
        <Route path="/vehicles/:id" element={<VehicleDetail/>} />
        <Route path="/my-vehicles" element={<MyVehicles/>} />
        <Route path="/graph-vehicles" element={<GraphVehicles/>}/>
        <Route path="/check-email" element={<CheckEmail/>} />
        <Route path="/activate" element={<Activate />}/>
        {/*KAN-59 Route to handle Google OAuth2 callback and save token */}
        <Route path="/google-callback" element={<GoogleCallback />} />
        {/*KAN-73 Route for Google users to validate cedula after OAuth registration */}
        <Route path="/google-cedula" element={<GoogleCedula />} />
      </Routes>

      {/*KAN-43 Inbox drawer. Renders on top of current page */}
      {inboxOpen && (
        <>
          {/*KAN-43 Backdrop. Click to close */}
          <div
            className="inbox-backdrop"
            onClick={() => setInboxOpen(false)}
          />

          {/*KAN-43 Drawer panel*/}
          <div className="inbox-drawer">
            <div className="inbox-drawer-header">
              <span className="inbox-drawer-title">Inbox</span>
              <button
                className="inbox-close-btn"
                onClick={() => setInboxOpen(false)}
              >
                ✕
              </button>
            </div>
            <Inbox />
          </div>
        </>
      )}
    </Router>
  );
}

export default App;