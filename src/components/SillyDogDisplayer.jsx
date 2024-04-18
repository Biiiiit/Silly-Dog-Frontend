import React from 'react';
import './css/SillyDogDisplayer.css';
import SillyDoggy from '../assets/SillyDoggy.png'

const SillyDogDisplay = () => {
  const dummyDog = {
    image: SillyDoggy, // Dummy image URL
    description: 'This is a silly dog.', // Dummy description
    status: 'Happy', // Dummy status
    nationality: 'Dogland', // Dummy nationality
    aliases: ['Fluffy', 'Paws'], // Dummy aliases array
    relatives: ['Buddy', 'Rover'], // Dummy relatives array
    occupation: 'Professional Tail Wagger', // Dummy occupation
    dateOfBirth: 'April 1, 2015', // Dummy date of birth
    placeOfBirth: 'Dogville', // Dummy place of birth
    dateOfDeath: 'N/A', // Dummy date of death
    placeOfDeath: 'N/A', // Dummy place of death
    maritalStatus: 'Single', // Dummy marital status
    gender: 'Male', // Dummy gender
    height: '20 inches', // Dummy height
    weight: '10 pounds' // Dummy weight
  };

  return (
      <div className="silly-dog-display">
        <img className='display-image' src={dummyDog.image} alt="Dog" />
        <p><strong>Description:</strong> {dummyDog.description}</p>
        <p><strong>Status:</strong> {dummyDog.status}</p>
        <p><strong>Nationality:</strong> {dummyDog.nationality}</p>
        <div className="aliases-relatives">
          <p><strong>Aliases:</strong> {dummyDog.aliases.join(', ')}</p>
          <p><strong>Relatives:</strong> {dummyDog.relatives.join(', ')}</p>
        </div>
        <p><strong>Occupation:</strong> {dummyDog.occupation}</p>
        <hr />
        <h3>Biographical Information</h3>
        <div className="bio-info">
          <p><strong>Date of Birth:</strong> {dummyDog.dateOfBirth}</p>
          <p><strong>Place of Birth:</strong> {dummyDog.placeOfBirth}</p>
        </div>
        <div className="bio-info">
          <p><strong>Date of Death:</strong> {dummyDog.dateOfDeath}</p>
          <p><strong>Place of Death:</strong> {dummyDog.placeOfDeath}</p>
        </div>
        <p><strong>Marital Status:</strong> {dummyDog.maritalStatus}</p>
        <hr />
        <h3>Physical Description</h3>
        <p><strong>Gender:</strong> {dummyDog.gender}</p>
        <div className="physical-description">
          <p><strong>Height:</strong> {dummyDog.height}</p>
          <p><strong>Weight:</strong> {dummyDog.weight}</p>
        </div>
      </div>
  );
}

export default SillyDogDisplay;
