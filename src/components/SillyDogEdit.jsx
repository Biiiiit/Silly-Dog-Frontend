import React, { useState, useRef, useEffect } from 'react';
import './css/SillyDogDisplayer.css';
import SillyDoggy from '../assets/SillyDoggy.png'

const SillyDogEdit = ({ dogInfo, onSave, onClose }) => {
    const [editedDogInfo, setEditedDogInfo] = useState(dogInfo);
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.silly-dog-display-edit-content')) {
                onClose(); // Call onClose when clicking outside the modal content
            }
        };

        // Attach event listener to the entire document
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Remove event listener when component unmounts
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedDogInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Call the onSave function with the edited dogInfo
        onSave(editedDogInfo);
    };

    return (
        <div className='silly-dog-display-edit'>
            <div className="silly-dog-display-edit-content">
                <div className='edit-buttons'>
                    <button className="edit-close-button" onClick={onClose}>X</button>
                    <button className='edit-save-button' onClick={handleSave}>Save</button>
                </div>
                <img className='edit-display-image' src={SillyDoggy} alt="Dog" />
                <label>
                    Description:
                    <input className='edit-input' type="text" name="description" value={editedDogInfo.description || ''} onChange={handleInputChange} />
                </label>
                <label>
                    Status:
                    <input className='edit-input' type="text" name="status" value={editedDogInfo.status || ''} onChange={handleInputChange} />
                </label>
                <label>
                    Nationality:
                    <input className='edit-input' type="text" name="nationality" value={editedDogInfo.nationality || ''} onChange={handleInputChange} />
                </label>
                <div className="aliases-relatives">
                    <label>
                        Aliases:
                        <input className='edit-input' type="text" name="aliases" value={editedDogInfo.aliases.join(', ') || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Relatives:
                        <input className='edit-input' type="text" name="relatives" value={editedDogInfo.relatives.join(', ') || ''} onChange={handleInputChange} />
                    </label>
                </div>
                <label>
                    Occupation:
                    <input className='edit-input' type="text" name="occupation" value={editedDogInfo.occupation || ''} onChange={handleInputChange} />
                </label>
                <hr />
                <h3>Biographical Information</h3>
                <div className="bio-info">
                    <label>
                        Date of Birth:
                        <input className='edit-input' type="text" name="dateOfBirth" value={editedDogInfo.dateOfBirth || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Place of Birth:
                        <input className='edit-input' type="text" name="placeOfBirth" value={editedDogInfo.placeOfBirth || ''} onChange={handleInputChange} />
                    </label>
                </div>
                <div className="bio-info">
                    <label>
                        Date of Death:
                        <input className='edit-input' type="text" name="dateOfDeath" value={editedDogInfo.dateOfDeath || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Place of Death:
                        <input className='edit-input' type="text" name="placeOfDeath" value={editedDogInfo.placeOfDeath || ''} onChange={handleInputChange} />
                    </label>
                </div>
                <label>
                    Marital Status:
                    <input className='edit-input' type="text" name="maritalStatus" value={editedDogInfo.maritalStatus || ''} onChange={handleInputChange} />
                </label>
                <hr />
                <h3>Physical Description</h3>
                <label>
                    Gender:
                    <input className='edit-input' type="text" name="gender" value={editedDogInfo.gender || ''} onChange={handleInputChange} />
                </label>
                <div className="physical-description">
                    <label>
                        Height:
                        <input className='edit-input' type="text" name="height" value={editedDogInfo.height || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Weight:
                        <input className='edit-input' type="text" name="weight" value={editedDogInfo.weight || ''} onChange={handleInputChange} />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default SillyDogEdit;
