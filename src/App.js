import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import Videos from "./pages/Videos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminRestrictedUsers from "./pages/AdminRestricted";
import NewProfile from "./pages/NewProfile";
import SelectProfile from "./pages/Selectprofile";
import Edit from "./pages/Edit";
import Playlists from "./pages/Playlists";
import UserPlaylists from "./pages/UserPlaylists";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Barra de Navegación Mejorada */}
        <Navbar expand="lg" className="navbar-light bg-light p-2">
          <Container className="d-flex align-items-center">
            <Navbar.Brand as={Link} to="/" className="fw-bold text-dark d-flex align-items-center">
              <img src="/tube.png" alt="KidsTube Logo" width="50" height="50" className="me-2 rounded-circle border border-white" />
              KidsTube 
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/home" className="text-dark">Inicio</Nav.Link>
                <Nav.Link as={Link} to="/videos" className="text-dark">Administración</Nav.Link>
                <Nav.Link as={Link} to="/playlists" className="text-dark">Playlists</Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-dark">Registro</Nav.Link>
                <Nav.Link as={Link} to="/" className="text-dark">Login</Nav.Link>
                <Nav.Link as={Link} to="/" className="text-dark">Cerrar Sesion</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Rutas */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/select-profile" element={<SelectProfile />} />
          <Route path="/new-profile" element={<NewProfile />} />
          <Route path="/AdminRestricted" element={<AdminRestrictedUsers />} />
          <Route path="/edit/:profileId" element={<Edit/>} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/user-playlists" element={<UserPlaylists />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
