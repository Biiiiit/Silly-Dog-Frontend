import React, { useState } from 'react';
import './css/SillyDogDisplayer.css';
import SillyDoggy from '../assets/SillyDoggy.png'

const SillyDogEdit = ({ dogInfo, onSave }) => {
    const [editedDogInfo, setEditedDogInfo] = useState(dogInfo);

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
                <img className='display-image' src={SillyDoggy} alt="Dog" />
                <label>
                    Description:
                    <input type="text" name="description" value={editedDogInfo.description || ''} onChange={handleInputChange} />
                </label>
                <label>
                    Status:
                    <input type="text" name="status" value={editedDogInfo.status || ''} onChange={handleInputChange} />
                </label>
                <label>
                    Nationality:
                    <input type="text" name="nationality" value={editedDogInfo.nationality || ''} onChange={handleInputChange} />
                </label>
                <div className="aliases-relatives">
                    <label>
                        Aliases:
                        <input type="text" name="aliases" value={editedDogInfo.aliases.join(', ') || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Relatives:
                        <input type="text" name="relatives" value={editedDogInfo.relatives.join(', ') || ''} onChange={handleInputChange} />
                    </label>
                </div>
                <label>
                    Occupation:
                    <input type="text" name="occupation" value={editedDogInfo.occupation || ''} onChange={handleInputChange} />
                </label>
                <hr />
                <h3>Biographical Information</h3>
                <div className="bio-info">
                    <label>
                        Date of Birth:
                        <input type="text" name="dateOfBirth" value={editedDogInfo.dateOfBirth || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Place of Birth:
                        <input type="text" name="placeOfBirth" value={editedDogInfo.placeOfBirth || ''} onChange={handleInputChange} />
                    </label>
                </div>
                <div className="bio-info">
                    <label>
                        Date of Death:
                        <input type="text" name="dateOfDeath" value={editedDogInfo.dateOfDeath || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Place of Death:
                        <input type="text" name="placeOfDeath" value={editedDogInfo.placeOfDeath || ''} onChange={handleInputChange} />
                    </label>
                </div>
                <label>
                    Marital Status:
                    <input type="text" name="maritalStatus" value={editedDogInfo.maritalStatus || ''} onChange={handleInputChange} />
                </label>
                <hr />
                <h3>Physical Description</h3>
                <label>
                    Gender:
                    <input type="text" name="gender" value={editedDogInfo.gender || ''} onChange={handleInputChange} />
                </label>
                <div className="physical-description">
                    <label>
                        Height:
                        <input type="text" name="height" value={editedDogInfo.height || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Weight:
                        <input type="text" name="weight" value={editedDogInfo.weight || ''} onChange={handleInputChange} />
                    </label>
                </div>
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};

export default SillyDogEdit;
