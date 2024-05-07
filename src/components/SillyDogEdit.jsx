import React, { useState, useRef, useEffect } from "react";
import { imageUploader } from "../services/Firebase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "./css/SillyDogDisplayer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons"; // Import the edit icon
import SillyDogManager from "../services/SillyDogManager";
import SillyDoggy from "../assets/SillyDoggy.png";

const SillyDogEdit = ({ dogInfo, onSave, onClose }) => {
  const [editedDogInfo, setEditedDogInfo] = useState(dogInfo);
  const modalRef = useRef();
  const fileInputRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (dogInfo && dogInfo.media && dogInfo.media[0]) {
      const fetchImageUrl = async () => {
        setImageUrl(
          await getDownloadURL(
            ref(imageUploader, dogInfo.media[0].locationReference)
          )
        );
      };
      fetchImageUrl();
    } else {
      setImageUrl(SillyDoggy);
    }
  }, [dogInfo]);

  useEffect(() => {
    if (media && media[0]) {
      const file = media[0];
      const reader = new FileReader();

      reader.onload = async (event) => {
        const imageUrl = event.target.result;
        setEditedDogInfo((prevState) => ({
          ...prevState,
          image: imageUrl,
        }));
        setImageUrl(imageUrl); // Update imageUrl state with the new image URL
      };

      reader.readAsDataURL(file);
    }
  }, [media]);

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

      if (fileType === "image") {
        let storageRef = ref(imageUploader, `${v4()}`);

        try {
          await uploadBytes(storageRef, file);
          const relativePath = storageRef.fullPath;

          mediaFiles.push({
            locationReference: relativePath,
            order: i + 1,
          });
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      } else {
        console.error("Unsupported file type:", fileType);
      }
    }

    const updatedDogInfo = {
      ...editedDogInfo,
      media: mediaFiles,
    };

    setEditedDogInfo(updatedDogInfo);

    try {
      // Check if the dog has an ID before updating
      if (editedDogInfo.id) {
        console.log(editedDogInfo.id);
        // Call the updateSillyDog method with the edited dog info
        await SillyDogManager.updateSillyDog(editedDogInfo.id, editedDogInfo);
        onClose();
      } else {
        console.error("Error saving art piece: Dog ID not found");
      }
    } catch (error) {
      console.error("Error saving art piece:", error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

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
            src={imageUrl || SillyDoggy}
            alt="Dog"
            onClick={handleImageClick} // Moved onClick to the image element
          />
          <div className="edit-overlay">
            <FontAwesomeIcon icon={faEdit} className="edit-icon" />
          </div>
        </label>
        <input
          id="fileInput"
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => setMedia(e.target.files)}
        />
        <label className="label">
          Image Caption:
          <br />
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
          Affiliations:
          <br></br>
          <span className="input-description">
            Characters connection by affiliation i.e. friendship<br></br>
            These don't need to be real affiliations, this is for a bit of fun.
            <br></br>
            Can be existing Silly Dogs.<br></br>
            Type them with a comma in between: "john, alice".
          </span>
          <input
            className="edit-input"
            type="text"
            name="affiliations"
            value={editedDogInfo.affiliations || ""}
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
            Weight of the dog measured in hamburgers.<br></br>1 hamburger is
            11.3 kilograms (0.25 pounds aka a quarter pounder), so calculate
            accordingly.<br></br>
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
