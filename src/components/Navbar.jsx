import React from "react";
import { Link } from "react-router-dom";
import "./css/Navbar.css";
import SillyDoggyImage from "../assets/SillyDoggy.webP";

function Navbar() {
  return (
    <header className="transparent-navbar">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-6 col-md-1">
            <div className="logo text-start">
              <Link to="/">
                <img src={SillyDoggyImage} width="50" height="50" alt="Logo" />
              </Link>
            </div>
          </div>
          <div className="col-7 col-md-3">
            <nav className="navbar-links text-start">
              <Link className="home-link" to="/">
                Silly Dog Wiki
              </Link>
              <ul className="d-flex">
                <li>
                  <div className="dropdown">
                    <a href="#" className="dropbtn">
                      Navigation
                    </a>
                    <div className="dropdown-content">
                      <a href="#">Link 1</a>
                      <a href="#">Link 2</a>
                      <a href="#">Link 3</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="dropdown">
                    <a href="#" className="dropbtn">
                      Contribution
                    </a>
                    <div className="dropdown-content">
                      <a href="#">Link 2</a>
                      <a href="#">Link 3</a>
                    </div>
                  </div>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
