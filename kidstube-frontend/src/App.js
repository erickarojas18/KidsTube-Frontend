import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
    </div>
  );
}

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Videos from './pages/Videos';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/videos" element={<Videos />} />
            </Routes>
        </Router>
    );
}

export default App;
