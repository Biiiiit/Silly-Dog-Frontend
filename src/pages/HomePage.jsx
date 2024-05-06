import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./css/HomePage.css";
import ContentContainer from "../components/ContentContainer";
import DogImage from "../assets/SillyDoggy.png";
import createDogImage from "../assets/createSillyDog.png";

const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleNextButtonClick = () => {
    // Navigate to CreateSillyDog page with input value appended to the URL
    navigate(`/CreateSillyDog/${inputValue}`);
  };

  return (
    <ContentContainer>
      <div className="container d-flex justify-content-center">
        <div className="content-with-image">
          <img src={DogImage} alt="Silly Dog" className="dog-image" />
          <div className="text-content">
            <h1>Welcome to Silly Dog Wiki!</h1>
            <p>
              This is the place for all your sillyness and inquiries about
              doggies.
            </p>
            <p>Feel free to look for some silly dogs and have fun.</p>
            <p>
              Disclaimer: This is not related to the Silly Cat Wiki, this is
              just a hobby project
            </p>
            <p>Feel free to add to the collection of doggies however {":)"}</p>
          </div>
        </div>
      </div>
      <div className="next-section">
        <div className="content-with-image">
          <div className="text-content">
            <h1>Create a Silly Dog</h1>
            <p>
              Are you ready to create your own Silly Dog? Well let's get started
              then. Type in the name of your Silly Dog below and click on the
              next button. We cant wait to see your new Silly Dog.
            </p>
            <div className="dogInput">
              <input
                className="doggyInput"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type here..."
              />
            </div>
            <br />
            <br />
            <button onClick={handleNextButtonClick}>Next</button>
          </div>
          <img src={createDogImage} alt="Silly Dog" className="dog-image" />
        </div>
      </div>
    </ContentContainer>
  );
};

export default HomePage;
