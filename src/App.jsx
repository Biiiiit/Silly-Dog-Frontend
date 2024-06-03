import "./App.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateSillyDog from "./pages/CreateSillyDog";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/HTTP Status dog API/ErrorBoundary";

function App() {
  // Global error handler
  window.addEventListener("error", function (event) {
    // Log the error to an error reporting service
    console.error("Global error caught:", event.error);
    // You can also set state in the ErrorBoundary here if necessary
  });
  return (
    <ErrorBoundary>
      <div className="App">
        <div className="background-container">
          <Router>
            <Navbar></Navbar>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/CreateSillyDog/:name"
                element={<CreateSillyDog />}
              />
            </Routes>
          </Router>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
