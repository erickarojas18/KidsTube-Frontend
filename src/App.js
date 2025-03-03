import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Videos from './pages/Videos.js';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>¡Hola, KidsTube está funcionando! 🎬</h1>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>

        {/* Aquí agregamos las rutas */}
        <Routes>
          <Route path="/videos" element={<Videos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
