import React, { useState, useEffect, useRef } from 'react';
import './css/CustomLinkModal.css';
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa'; // Import icons from react-icons library

const CustomLinkModal = ({ onCancel, visible, onAddLink }) => {
  const [linkType, setLinkType] = useState('Silly Dog Wiki');
  const [linkUrl, setLinkUrl] = useState('');
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const modalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      const linkButton = document.querySelector('.rdw-option-wrapper[title="Link"]');
      if (linkButton) {
        const linkButtonRect = linkButton.getBoundingClientRect();
        const modalTop = linkButtonRect.bottom;
        const modalLeft = linkButtonRect.left;
        setModalPosition({ top: modalTop, left: modalLeft });
      }
    }
  }, [visible]);

  const handleLinkTypeChange = (selectedType) => {
    if (selectedType !== linkType) {
      setLinkType(selectedType);
    }
  };

  const handleInsertLink = () => {
    if (linkUrl.trim() !== '') {
      // Call the onAddLink function with the link URL
      onAddLink(linkUrl);
  
      // Close custom modal
      onCancel();
    }
  };

  const renderLinkInput = () => {
    if (linkType === 'Silly Dog Wiki') {
      return (
        <div className='inputLink'>
          <FaSearch />
          <input
            className='linkInputSilly'
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </div>
      );
    } else if (linkType === 'External Site') {
      return (
        <div className='inputLinkExternal'>
          <FaExternalLinkAlt className="float-left"/>
          <input
            className='linkInputExternal'
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="custom-link-modal" style={{ display: visible ? 'block' : 'none', position: 'absolute', top: modalPosition.top, left: modalPosition.left }} ref={modalRef}>
      <div className="custom-link-modal-title">
        <button className="custom-link-modal-close" onClick={onCancel}>X</button>
        <span><b>Add a Link</b></span>
        <button className="custom-link-modal-insert" onClick={handleInsertLink}>Insert</button>
      </div>
      <div className="custom-link-modal-content">
        <div className="link-type-buttons">
          <button className={`link-type-button ${linkType === 'Silly Dog Wiki' ? 'selected' : ''}`} onClick={() => handleLinkTypeChange('Silly Dog Wiki')}>
            Silly Dog Wiki
          </button>
          <button className={`link-type-button ${linkType === 'External Site' ? 'selected' : ''}`} onClick={() => handleLinkTypeChange('External Site')}>
            External Site
          </button>
        </div>
        {renderLinkInput()}
      </div>
    </div>
  );
};

export default CustomLinkModal;
