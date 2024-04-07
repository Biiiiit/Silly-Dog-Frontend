import './App.css';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import HomePage from "./pages/HomePage"
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <div className="background-container">
        <Router>
        <Navbar></Navbar>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
