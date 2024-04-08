import React from 'react';
import "./css/CreateSillyDog.css";
import ContentContainer from '../components/ContentContainer';

const CreateDogPage = () => {
  return (
      <ContentContainer>
        <div className="content-with-image">
        <div className="text-start">
            <h1>Name:</h1>
            <p>Created by username on date</p>
        </div>
        </div>
      </ContentContainer>
  );
};

export default CreateDogPage;
