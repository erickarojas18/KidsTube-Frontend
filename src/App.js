import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import Videos from "./pages/Videos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminRestrictedUsers from "./pages/AdminRestricted";
import NewProfile from "./pages/NewProfile";
import SelectProfile from "./pages/Selectprofile";
import Edit from "./pages/Edit";
import Playlists from "./pages/Playlists";
import UserPlaylists from "./pages/UserPlaylists";
import VerifyEmail from "./pages/VerifyEmail";
import Verify from "./pages/Verify";
import "./App.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";

// Crear cliente de Apollo
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // Cambia esto a la URL de tu servidor GraphQL
  cache: new InMemoryCache()
});

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
    <ApolloProvider client={client}>
      <GoogleOAuthProvider clientId="466347798092-sku8a8shlnrkvh0tsktj97nf7ibcg8s2.apps.googleusercontent.com">
        <Router>
          <NavigationBar />
          <Routes>
            <Route path="/" element={<Login />} />
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
      </GoogleOAuthProvider>
    </ApolloProvider>
  );
}

export default App;
