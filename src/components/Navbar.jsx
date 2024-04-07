import React from "react";
import { Link } from "react-router-dom";
import "./css/Navbar.css";

function Navbar() {
  return (
    <header className="transparent-navbar">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-6 col-md-1">
            <div className="logo text-start">
              <Link to="/">
                <img
                  src='assets/SillyDoggy.png'
                  width="50"
                  height="50"
                  alt="Logo"
                />
              </Link>
            </div>
          </div>
          <div className="col-7 col-md-3">
            <nav className="navbar-links text-start">
              <Link className="home-link" to="/">Silly Dog Wiki</Link>
              <ul className="d-flex">
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/services">Services</Link>
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
