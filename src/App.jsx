import Register from "./pages/Register";
import Login from "./pages/Login";
import Vehicles from "./pages/Vehicles";
import "./App.css";

//Main App
function App() {
  return (
    <div className="forms-container">
      <div className="card">
        <Register />
      </div>

      <div className="card">
        <Login />
      </div>

      <div className="card">
        <Vehicles />
      </div>
    </div>
  );
}

export default App;