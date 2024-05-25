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
    affiliation: ["Snoopy"],
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
        <strong>Description:</strong>{" "}
        <span style={{ whiteSpace: "nowrap" }}>{dummyDog.description}</span>
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span style={{ whiteSpace: "nowrap" }}>{dummyDog.status}</span>
      </p>
      <p>
        <strong>Nationality:</strong>{" "}
        <span style={{ whiteSpace: "nowrap" }}>{dummyDog.nationality}</span>
      </p>
      <div className="aliases-relatives">
        <p>
          <strong>Aliases:</strong>{" "}
          {dummyDog.aliases && dummyDog.aliases.length
            ? dummyDog.aliases.join(", ")
            : ""}
        </p>
        <p>
          <strong>Relatives:</strong>{" "}
          {dummyDog.relatives && dummyDog.relatives.length
            ? dummyDog.relatives.join(", ")
            : ""}
        </p>
        <p>
          <strong>Affiliations:</strong>{" "}
          {dummyDog.affiliation && dummyDog.affiliation.length
            ? dummyDog.affiliation.join(", ")
            : ""}
        </p>

      </div>
      <p>
        <strong>Occupation:</strong>{" "}
        <span style={{ whiteSpace: "nowrap" }}>{dummyDog.occupation}</span>
      </p>
      <hr />
      <h3>Biographical Information</h3>
      <div className="bio-info">
        <p>
          <strong>Date of Birth:</strong>{" "}
          <span style={{ whiteSpace: "nowrap" }}>{dummyDog.dateOfBirth}</span>
        </p>
        <p>
          <strong>Place of Birth:</strong>{" "}
          <span style={{ whiteSpace: "nowrap" }}>{dummyDog.placeOfBirth}</span>
        </p>
      </div>
      <p>
        <strong>Marital Status:</strong>{" "}
        <span style={{ whiteSpace: "nowrap" }}>{dummyDog.maritalStatus}</span>
      </p>
      <hr />
      <h3>Physical Description</h3>
      <p>
        <strong>Gender:</strong>{" "} 
        <span style={{ whiteSpace: "nowrap" }}>{dummyDog.gender}</span>
      </p>
      <div className="physical-description">
        <p>
          <strong>Height:</strong>{" "}
          <span style={{ whiteSpace: "nowrap" }}>{dummyDog.height}</span>
        </p>
        <p>
          <strong>Weight:</strong>{" "}
          <span style={{ whiteSpace: "nowrap" }}>{dummyDog.weight}</span>
        </p>
      </div>
    </div>
  );
};

export default SillyDogDisplay;
