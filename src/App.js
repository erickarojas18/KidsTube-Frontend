import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Videos from "./pages/Videos.js";
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
          <Route path="/" element={<Videos />} />
          <Route path="/videos" element={<Videos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

