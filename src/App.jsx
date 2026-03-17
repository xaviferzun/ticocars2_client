import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import MyVehicles from "./pages/MyVehicles";
import Inbox from "./pages/Inbox";
import "./App.css";

//Navbar component
function Navbar() {
  const navigate = useNavigate();
  //Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/vehicles");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2>TicoCars</h2>
      </div>

      <div className="nav-right">
        <Link to="/vehicles">Vehículos</Link>

        {/*My Vehicles*/}
        <Link to={isAuthenticated ? "/my-vehicles" : "/login"}>
          Mis Vehículos
        </Link>

        <Link to="/inbox">Inbox</Link>

        {isAuthenticated ? (
          <button onClick={handleLogout}>Cerrar sesión</button>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Main page */}
        <Route path="/" element={<Vehicles />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/my-vehicles" element={<MyVehicles />} />
        <Route path="/inbox" element={<Inbox />} />
      </Routes>
    </Router>
  );
}

export default App;