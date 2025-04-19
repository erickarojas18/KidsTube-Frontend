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
import VerifyEmail from "./pages/VerifyEmail";
import Verify  from "./pages/Verify";
import "./App.css";
import { useState, useEffect } from "react";

// Componente para la barra de navegación
function NavigationBar() {
  const location = useLocation();
  const isUserPlaylistsRoute = location.pathname === '/user-playlists';
  const isVerifyEmailRoute = location.pathname === '/verify-email';

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">KidsTube</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isUserPlaylistsRoute || isVerifyEmailRoute ? (
            <Nav className="ms-auto">
              <Nav.Link href="/login">Iniciar Sesión</Nav.Link>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link href="/login">Inicio</Nav.Link>
              <Nav.Link href="/videos">Videos</Nav.Link>
              <Nav.Link href="/playlists">Playlists</Nav.Link>
              <Nav.Link href="/Register">Registro</Nav.Link>
              <Nav.Link href="/AdminRestricted">Administración</Nav.Link>
              <Nav.Link href="/login">Iniciar Sesión</Nav.Link>
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
      <NavigationBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/AdminRestricted" element={<AdminRestrictedUsers />} />
        <Route path="/new-profile" element={<NewProfile />} />
        <Route path="/select-profile" element={<SelectProfile />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/user-playlists/:userId" element={<UserPlaylists />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify" element={<Verify />} />

      </Routes>
    </Router>
  );
}

export default App;
