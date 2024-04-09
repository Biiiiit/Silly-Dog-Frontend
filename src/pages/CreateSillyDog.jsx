import React, { useState, useEffect } from 'react';
import ContentContainer from '../components/ContentContainer';
import { EditorState, RichUtils, Modifier, Entity } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './css/CreateSillyDog.css';
import './css/Editor.css';
import CustomLinkModal from '../components/CustomLinkModal';

const CreateDogPage = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [showCustomLinkModal, setShowCustomLinkModal] = useState(false);

  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    // console.log(html);
  }, [editorState]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        // Check if a new .rdw-link-modal element is added to the DOM
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach(node => {
            if (node.classList && node.classList.contains('rdw-link-modal')) {
              // Hide the default link modal
              node.style.display = 'none';

              // Prevent the default modal from closing automatically
              node.addEventListener('click', (e) => {
                e.stopPropagation();
              });
            }
          });
        }
      });
    });


    // Start observing mutations in the body element
    observer.observe(document.body, { childList: true, subtree: true });

    // Find and add event listener to the link button wrapper
    const linkButtonWrapper = document.querySelector('.rdw-option-wrapper[title="Link"]');
    if (linkButtonWrapper) {
      linkButtonWrapper.addEventListener('click', openCustomLinkModal);
    }

    return () => {
      // Clean up event listener and observer when component unmounts
      if (linkButtonWrapper) {
        linkButtonWrapper.removeEventListener('click', openCustomLinkModal);
      }
      observer.disconnect();
    };
  }, []);

  const openCustomLinkModal = () => {
    setShowCustomLinkModal(true); // Set state to true when link button is clicked

    // Hide the default modal
    const defaultModal = document.querySelector('.rdw-link-modal');
    if (defaultModal) {
      defaultModal.style.display = 'none';
    }

    // Add event listener to the default link button wrapper
    const defaultLinkButton = document.querySelector('.rdw-option-wrapper[title="Link"]');
    if (defaultLinkButton) {
      defaultLinkButton.addEventListener('click', handleDefaultLinkButtonClick);
    }
  };

  const handleDefaultLinkButtonClick = () => {
    console.log('Default link button clicked.'); // Log when default link button is clicked
  };

  const handleCloseModal = () => {
    setShowCustomLinkModal(false); // Function to close the modal

    // Show the default modal
    const defaultModal = document.querySelector('.rdw-link-modal');
    if (defaultModal && !defaultModal.getAttribute('data-persist')) {
      defaultModal.style.display = 'block';
    }

    // Remove event listener from the default link button wrapper
    const defaultLinkButton = document.querySelector('.rdw-option-wrapper[title="Link"]');
    if (defaultLinkButton) {
      defaultLinkButton.removeEventListener('click', handleDefaultLinkButtonClick);
    }
  };

  const handleAddLink = (url, title) => {
    // Get the current editor state
    let currentEditorState = editorState;
  
    // Get the current content
    const contentState = currentEditorState.getCurrentContent();
  
    // Get the selection
    const selectionState = currentEditorState.getSelection();
  
    // Create a new content state with the URL as text
    const contentStateWithLink = Modifier.insertText(
      contentState,
      selectionState,
      url,
      null,
      Entity.create('LINK', 'MUTABLE', { url: url, title: title })
    );
  
    // Update the editor state with the new content
    currentEditorState = EditorState.push(
      currentEditorState,
      contentStateWithLink,
      'insert-characters'
    );
  
    // Move the selection to the end of the inserted link
    const newSelection = selectionState.merge({
      anchorOffset: selectionState.getEndOffset(),
      focusOffset: selectionState.getEndOffset(),
    });
  
    // Set the new editor state with the updated selection
    currentEditorState = EditorState.forceSelection(currentEditorState, newSelection);
  
    // Update the editor state
    setEditorState(currentEditorState);
  
    // Close the custom link modal
    handleCloseModal();
  };
  

  // Custom toolbar options
  const toolbarOptions = {
    options: ['history', 'inline', 'blockType', 'list', 'textAlign', 'link', 'embedded'],
    history: {
      inDropdown: false,
      options: ['undo', 'redo'],
    },
    blockType: {
      inDropdown: true,
      options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
    },
    inline: {
      inDropdown: false,
      options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript'],
    },
    list: {
      inDropdown: false,
      options: ['unordered', 'ordered'],
    },
    textAlign: {
      inDropdown: true,
      options: ['left', 'center', 'right', 'justify'],
    },
    link: {
      inDropdown: false,
    },
    embedded: {
      inDropdown: false,
      options: ['link', 'image', 'video'],
    },
  };

  return (
    <ContentContainer>
      <CustomLinkModal
        onAddLink={handleAddLink} // Pass the function to receive link URL from custom modal
        onCancel={handleCloseModal}
        visible={showCustomLinkModal}
      />
      <div className="content-with-image">
        <div className="text-start">
          <h1>Name:</h1>
          <p>Created by username on date</p>
          <p>table of contents</p>
          {/* Render the text editor component */}
          <div className="editor-container">
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
              toolbar={toolbarOptions}
              // Handle key command for undo and redo
              handleKeyCommand={(command, editorState) => {
                const newState = RichUtils.handleKeyCommand(editorState, command);
                if (newState) {
                  onEditorStateChange(newState);
                  return 'handled';
                }
                return 'not-handled';
              }}
            />
          </div>
        </div>
      </div>
    </ContentContainer>
  );
};

export default CreateDogPage;
