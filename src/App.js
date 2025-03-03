import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Videos from "./pages/Videos.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Home from "./pages/Home.js";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-dark bg-dark p-2">
          <Link className="navbar-brand ms-3" to="/">
            KidsTube 🎬
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Login />} />      {/* Nueva ruta de Login */}
          <Route path="/register" element={<Register />} />  {/* Ruta para Registro */}
          <Route path="/home" element={<Home />} />  {/* Ruta para Home */}
          <Route path="/videos" element={<Videos />} />  {/* Ruta para Videos */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
