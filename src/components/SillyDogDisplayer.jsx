import React, { useEffect, useState } from "react";
import "./css/SillyDogDisplayer.css";
import SillyDoggy from "../assets/SillyDoggy.png";
import { getDownloadURL, ref } from "firebase/storage";
import { imageUploader } from "../services/Firebase";

const SillyDogDisplay = ({ dogInfo, onClick }) => {
  console.log("onClick prop in SillyDogDisplay:", onClick);
  const handleDisplayClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent elements
    console.log("cliiiiicked");
    // Call the onClick function passed from the parent component
    if (onClick) {
      onClick();
    }
  };
  
  const dummyDog = dogInfo || {
    image: SillyDoggy, // Dummy image URL
    media: [],
    description: "This is a silly dog.", // Dummy description
    status: "Happy", // Dummy status
    nationality: "Dogland", // Dummy nationality
    aliases: ["Fluffy", "Paws"], // Dummy aliases array
    relatives: ["Buddy", "Rover"], // Dummy relatives array
    affiliations: ["Snoopy"],
    occupation: "Professional Tail Wagger", // Dummy occupation
    dateOfBirth: "April 1, 2015", // Dummy date of birth
    placeOfBirth: "Dogville", // Dummy place of birth
    dateOfDeath: "N/A", // Dummy date of death
    placeOfDeath: "N/A", // Dummy place of death
    maritalStatus: "Single", // Dummy marital status
    gender: "Male", // Dummy gender
    height: "20 inches", // Dummy height
    weight: "10 pounds", // Dummy weight
  };

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function getURL() {
      setImageUrl(
        await getDownloadURL(
          ref(imageUploader, dogInfo.media[0].locationReference)
        )
      );
    }
    getURL();
  }, [dogInfo]);

  return (
    <div className="silly-dog-display" onClick={handleDisplayClick}>
      <img className="display-image" src={imageUrl} alt="Dog" />
      <p>
        <strong>Description:</strong> {dummyDog.description}
      </p>
      <p>
        <strong>Status:</strong> {dummyDog.status}
      </p>
      <p>
        <strong>Nationality:</strong> {dummyDog.nationality}
      </p>
      <div className="aliases-relatives">
        <p>
          <strong>Aliases:</strong> {dummyDog.aliases}
        </p>
        <p>
          <strong>Relatives:</strong> {dummyDog.relatives}
        </p>
        <p>
          <strong>Affiliations:</strong> {dummyDog.affiliations}
        </p>
      </div>
      <p>
        <strong>Occupation:</strong> {dummyDog.occupation}
      </p>
      <hr />
      <h3>Biographical Information</h3>
      <div className="bio-info">
        <p>
          <strong>Date of Birth:</strong> {dummyDog.dateOfBirth}
        </p>
        <p>
          <strong>Place of Birth:</strong> {dummyDog.placeOfBirth}
        </p>
      </div>
      <p>
        <strong>Marital Status:</strong> {dummyDog.maritalStatus}
      </p>
      <hr />
      <h3>Physical Description</h3>
      <p>
        <strong>Gender:</strong> {dummyDog.gender}
      </p>
      <div className="physical-description">
        <p>
          <strong>Height:</strong> {dummyDog.height}
        </p>
        <p>
          <strong>Weight:</strong> {dummyDog.weight}
        </p>
      </div>
    </div>
  );
};

export default SillyDogDisplay;
