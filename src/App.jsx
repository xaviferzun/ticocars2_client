import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; //Importing necessary components and pages for the application
import Register from "./pages/Register";
import Login from "./pages/Login";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import "./App.css";

//Main App component with routes for the application using React Router.
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
      </Routes>
    </Router>
  );
}

export default App;