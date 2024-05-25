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
      setTimeout(() => {
        const linkButtonWrapper = document.querySelector('.rdw-option-wrapper[title="Link"]');
        if (linkButtonWrapper) {
          const editorContainer = document.querySelector('.editor-container');
          if (editorContainer) {
            const editorRect = editorContainer.getBoundingClientRect();
            const linkButtonRect = linkButtonWrapper.getBoundingClientRect();
            const top = linkButtonRect.bottom - editorRect.top + window.pageYOffset + 10; // Adjust for window scroll
            const left = linkButtonRect.left - editorRect.left - 10;
            setModalPosition({ top, left });
          }
        }
      }, 100); // Adjust the delay as needed
    }
  }, []);  

  const linkButtonWrapper = document.querySelector('.rdw-option-wrapper[title="Link"]');
  if (linkButtonWrapper) {
    const rect = linkButtonWrapper.getBoundingClientRect();
    const editorContainer = document.querySelector('.editor-container'); // Assuming this is the container for the editor
    if (editorContainer) {
      const editorRect = editorContainer.getBoundingClientRect();
      const top = rect.bottom - editorRect.top + 190;
      const left = rect.left - editorRect.left - 40;
      const customLinkModal = document.querySelector('.custom-link-modal'); // Assuming this is the class name of your custom link modal
      if (customLinkModal) {
        customLinkModal.style.top = `${top}px`;
        customLinkModal.style.left = `${left}px`;
      }
    }
  }

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
          <FaExternalLinkAlt className="float-left" />
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
