import React, { useState, useRef, useEffect } from "react";
import { imageUploader } from "../services/Firebase";
import { v4 } from "uuid";
import { ref, uploadBytes } from "firebase/storage";
import "./css/SillyDogDisplayer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons"; // Import the edit icon
import SillyDogManager from "../services/SillyDogManager";

const SillyDogEdit = ({ dogInfo, onSave, onClose }) => {
  const [editedDogInfo, setEditedDogInfo] = useState(dogInfo);
  const modalRef = useRef();
  const fileInputRef = useRef(null);
  const [media, setMedia] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDogInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const mediaFiles = [];
    for (let i = 0; i < media.length; i++) {
      const file = media[i];
      const fileType = file.type.split("/")[0];

      let storageRef;
      if (fileType === "image") {
        storageRef = ref(imageUploader, `${v4()}`);
      } else {
        continue;
      }

      try {
        const uploadTask = await uploadBytes(storageRef, file);
        const relativePath = storageRef.fullPath;

        mediaFiles.push({
          locationReference: relativePath,
          order: i + 1,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    editedDogInfo.media = mediaFiles;

    try {
      const newDog = await SillyDogManager.saveSillyDog(editedDogInfo);
    } catch (error) {
      console.error("Error saving art piece:", error);
    }
  };

  const handleImageClick = () => {
    // Trigger file input click when the image is clicked
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (media && media[0]) {
      // Handle image change when a new image is selected
      const file = media[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        setEditedDogInfo((prevState) => ({
          ...prevState,
          image: event.target.result, // Set image to base64 string
        }));
      };

      reader.readAsDataURL(file);
    }
  }, [media]);

  return (
    <div className="silly-dog-display-edit">
      <div className="silly-dog-display-edit-content">
        <div className="edit-buttons">
          <button className="edit-close-button" onClick={onClose}>
            X
          </button>
          <button className="edit-save-button" onClick={handleSave}>
            Save
          </button>
        </div>
        <label className="edit-image-container" htmlFor="fileInput">
          <img
            className="edit-display-image"
            src={editedDogInfo.image || SillyDoggy}
            alt="Dog"
          />
          <div className="edit-overlay">
            <FontAwesomeIcon icon={faEdit} className="edit-icon" />
          </div>
        </label>
        <input
          id="fileInput"
          type="file"
          //   ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => setMedia(e.target.files)}
        />
        <label className="label">
          Image Caption:
          <br></br>
          <span className="input-description">
            A small text to caption the image: "Wot 'n tarnation"
          </span>
          <input
            className="edit-input"
            type="text"
            name="description"
            value={editedDogInfo.description || ""}
            onChange={handleInputChange}
          />
        </label>
        <label className="label">
          Status:
          <br></br>
          <span className="input-description">
            Status of the dog. Choose between 3<br></br>Example: Alive, Dead,
            Unknown.
          </span>
          <input
            className="edit-input"
            type="text"
            name="status"
            value={editedDogInfo.status || ""}
            onChange={handleInputChange}
          />
        </label>
        <label className="label">
          Nationality:
          <br></br>
          <span className="input-description">
            Input any existing nationality (or fake if needed).<br></br>
            Example: American, Swedish, English, (Martian).
          </span>
          <input
            className="edit-input"
            type="text"
            name="nationality"
            value={editedDogInfo.nationality || ""}
            onChange={handleInputChange}
          />
        </label>
        <label className="label">
          Aliases:
          <br></br>
          <span className="input-description">
            Characters alternate names.<br></br>
            Type them with a comma in between: "name, name".
          </span>
          <input
            className="edit-input"
            type="text"
            name="aliases"
            value={editedDogInfo.aliases || ""}
            onChange={handleInputChange}
          />
        </label>
        <label className="label">
          Relatives:
          <br></br>
          <span className="input-description">
            Characters connection by blood or marriage :)<br></br>
            These don't need to be real family members, this is for a bit of
            fun.<br></br>
            Can be existing Silly Dogs.<br></br>
            Type them with a comma in between: "brother, mother".
          </span>
          <input
            className="edit-input"
            type="text"
            name="relatives"
            value={editedDogInfo.relatives || ""}
            onChange={handleInputChange}
          />
        </label>
        <label className="label">
          Occupation:
          <br></br>
          <span className="input-description">
            Characters job. Can be anything.<br></br>
            Example: "Trading bitcoin", "Baking cookies", "Dealing drugs".
          </span>
          <input
            className="edit-input"
            type="text"
            name="occupation"
            value={editedDogInfo.occupation || ""}
            onChange={handleInputChange}
          />
        </label>
        <hr />
        <h3>Biographical Information</h3>
        <label className="label">
          Date of Birth:
          <br></br>
          <span className="input-description">
            Birthday of the dog, needs to be in the DD/MM/YYYY format.<br></br>
            Type 'Unknown' if you dont know or make up one yourself. (or a fake
            one)<br></br>
            Average life span of a dog is 10-13 years, so take that into
            account.<br></br>
            Example: "05 May 2012", "Birth of the universe".
          </span>
          <input
            className="edit-input"
            type="text"
            name="dateOfBirth"
            value={editedDogInfo.dateOfBirth || ""}
            onChange={handleInputChange}
          />
        </label>
        <label className="label">
          Place of Birth:
          <br></br>
          <span className="input-description">
            The exact or estimated place of where the dog was born.<br></br>
            Type "unknown" if you dont know.<br></br>
            Example: "New York".
          </span>
          <input
            className="edit-input"
            type="text"
            name="placeOfBirth"
            value={editedDogInfo.placeOfBirth || ""}
            onChange={handleInputChange}
          />
        </label>
        <label className="label">
          Marital Status:
          <br></br>
          <span className="input-description">
            The dog's relationship status. Doesn't have to be real.<br></br>
            Example: "Married", "Single", "Divorced", "Seperated", etc.
          </span>
          <input
            className="edit-input"
            type="text"
            name="maritalStatus"
            value={editedDogInfo.maritalStatus || ""}
            onChange={handleInputChange}
          />
        </label>
        <hr />
        <h3>Physical Description</h3>
        <label className="label">
          Gender:
          <br></br>
          <span className="input-description">
            Gender of the dog. Can be something stupid too.<br></br>
            Example: "Male", "Female", "Dumbass".
          </span>
          <input
            className="edit-input"
            type="text"
            name="gender"
            value={editedDogInfo.gender || ""}
            onChange={handleInputChange}
          />
        </label>
        <label className="label">
          Height:
          <br></br>
          <span className="input-description">
            Height of the dog measured in hamburgers.<br></br>1 hamburger is 5.1
            centimetres (2 inches) tall, so calculate accordingly.<br></br>
            Example: "3 hamburgers".
          </span>
          <input
            className="edit-input"
            type="text"
            name="height"
            value={editedDogInfo.height || ""}
            onChange={handleInputChange}
          />
        </label>
        <label className="label">
          Weight:
          <br></br>
          <span className="input-description">
            Width of the dog measured in hamburgers.<br></br>1 hamburger is 11.4
            centimetres (4.5 inches) wide, so calculate accordingly.<br></br>
            Example: "8 hamburgers".
          </span>
          <input
            className="edit-input"
            type="text"
            name="weight"
            value={editedDogInfo.weight || ""}
            onChange={handleInputChange}
          />
        </label>
      </div>
    </div>
  );
};

export default SillyDogEdit;
