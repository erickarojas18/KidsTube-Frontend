import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import Videos from "./pages/Videos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Barra de Navegación Mejorada */}
        <Navbar expand="lg" className="navbar-light bg-light p-2">
  <Container>
    <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
      <img
        src="/tube.png" // Cambia esto por la ruta correcta de tu imagen
        alt="KidsTube Logo"
        width="40" // Ajusta el tamaño según necesites
        height="40"
        className="d-inline-block align-top me-2" // Espaciado a la derecha
      />
      KidsTube 
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ms-auto">
        <Nav.Link as={Link} to="/home" className="text-dark">Inicio</Nav.Link>
        <Nav.Link as={Link} to="/videos" className="text-dark">Videos</Nav.Link>
        <Nav.Link as={Link} to="/register" className="text-dark">Registro</Nav.Link>
        <Nav.Link as={Link} to="/" className="text-dark">Login</Nav.Link>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
