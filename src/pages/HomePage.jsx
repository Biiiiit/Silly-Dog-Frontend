import React from 'react';
import "./css/HomePage.css"
import ContentContainer from '../components/ContentContainer';
import DogImage from '../assets/SillyDoggy.png';

const HomePage = () => {
  return (
      <ContentContainer>
        <div className="container d-flex justify-content-center">
          <div className="content-with-image">
            <img src={DogImage} alt="Silly Dog" className="dog-image" />
            <div className="text-content">
              <h1>Welcome to Silly Dog Wiki!</h1>
              <p>This is the place for all your silliness and inquiries about doggies.</p>
              <p>Feel free to look for some silly dogs and have fun.</p>
              <p>Disclaimer: This is not related to the Silly Cat Wiki, this is just a hobby project</p>
            </div>
          </div>
        </div>
      </ContentContainer>
  );
};

export default HomePage;
