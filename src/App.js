import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
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
import { useState, useEffect } from "react";

// Componente para la barra de navegación
function NavigationBar() {
  const location = useLocation();
  const isUserPlaylistsRoute = location.pathname === '/user-playlists';

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">KidsTube</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isUserPlaylistsRoute ? (
            <Nav className="ms-auto">
              <Nav.Link href="/">Iniciar Sesión</Nav.Link>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link href="/">Inicio</Nav.Link>
              <Nav.Link href="/videos">Videos</Nav.Link>
              <Nav.Link href="/playlists">Playlists</Nav.Link>
              <Nav.Link href="/AdminRestricted">Administración</Nav.Link>
              <Nav.Link href="/">Iniciar Sesión</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
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
