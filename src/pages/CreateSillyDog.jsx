import React, { useState, useEffect } from 'react';
import ContentContainer from '../components/ContentContainer';
import { EditorState, RichUtils, Modifier, Entity, convertToRaw, convertFromRaw, convertFromHTML, ContentState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import html2canvas from 'html2canvas';
import DOMPurify from 'dompurify';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './css/CreateSillyDog.css';
import './css/Editor.css';
import CustomLinkModal from '../components/CustomLinkModal';
import SillyDogDisplay from '../components/SillyDogDisplayer';

const CreateDogPage = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [showEditor, setShowEditor] = useState(false);
  const [pageContent, setPageContent] = useState('placeholder for text');
  const [showCustomLinkModal, setShowCustomLinkModal] = useState(false); // Define showCustomLinkModal state variable

  const toggleEditor = () => {
    setShowEditor(!showEditor);

    // Load page content into editor when toggling
    if (!showEditor) {
      // Replace <br> tags with a unique marker
      const contentWithMarker = pageContent.replace(/<br\s*\/?>/gi, '[[BR]]');

      // Convert the modified HTML content to EditorState
      const blocksFromHTML = convertFromHTML(contentWithMarker);
      const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
      const editorState = EditorState.createWithContent(contentState);

      // Replace the marker with a special character that represents a single empty line
      const currentContent = editorState.getCurrentContent();
      const rawContentState = convertToRaw(currentContent);
      const updatedBlocks = rawContentState.blocks.map(block => ({
        ...block,
        text: block.text.replace(/\[\[BR\]\]/g, '\n') // Replace the marker with newline character
      }));
      const updatedContentState = convertFromRaw({ ...rawContentState, blocks: updatedBlocks });
      const updatedEditorState = EditorState.createWithContent(updatedContentState);

      setEditorState(updatedEditorState);
    }
  };

  function createMarkup(html) {
    return {
      __html: DOMPurify.sanitize(html)
    };
  }

  const onSaveContent = () => {
    // Get the current content state
    const contentState = editorState.getCurrentContent();

    // Convert the content state to HTML with link entities properly converted
    let html = convertToHTML({
      entityToHTML: (entity, originalText) => {
        if (entity.type === 'LINK') {
          return `<a href="${entity.data.url}" title="${entity.data.title}">${originalText}</a>`;
        }
        return originalText;
      },
    })(contentState);

    // Manipulate the HTML to handle empty blocks
    html = html.replace(/<p><\/p>/g, '<br>');

    // Save the HTML content
    setPageContent(html);
    toggleEditor(); // Hide the editor after saving
  };

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    // console.log(html);
  }, [editorState]);

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

    const tryToAddEventListener = () => {
      const linkButtonWrapper = document.querySelector('.rdw-option-wrapper[title="Link"]');
      if (linkButtonWrapper) {
        linkButtonWrapper.addEventListener('click', openCustomLinkModal);
      } else {
        // Retry after a short delay if the element is not found
        setTimeout(tryToAddEventListener, 100);
      }
    };

    // Try to add event listener when component mounts
    tryToAddEventListener();

    return () => {
      // Clean up event listener when component unmounts
      const linkButtonWrapper = document.querySelector('.rdw-option-wrapper[title="Link"]');
      if (linkButtonWrapper) {
        linkButtonWrapper.removeEventListener('click', openCustomLinkModal);
      }
    };
  }, []);

  // Add event listener to the default link button wrapper outside of toggle functions
  document.addEventListener('click', function (event) {
    // Check if the clicked element is the default link button
    if (event.target.classList.contains('rdw-option-wrapper') && event.target.getAttribute('title') === 'Link') {
      handleDefaultLinkButtonClick();
    }
  });

  const handleDefaultLinkButtonClick = () => {
    openCustomLinkModal();
  };

  const openCustomLinkModal = () => {
    setShowCustomLinkModal(true);
  };

  const handleCloseModal = () => {
    setShowCustomLinkModal(false);
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
      // onClick: handleOpenCustomLinkModal, // Changed from openCustomLinkModal to handleOpenCustomLinkModal
    },
    embedded: {
      inDropdown: false,
      options: ['link', 'image', 'video'],
    },
  };

  return (
    <ContentContainer>
      <CustomLinkModal
        onAddLink={handleAddLink}
        onCancel={handleCloseModal}
        visible={showCustomLinkModal}
      />
      <header className="header-container">
        <h1 className='name'>Name:</h1>
        <div className="button-container">
          <button onClick={toggleEditor} className="edit-button">
            {showEditor ? 'Hide Editor' : 'Edit'}
          </button>
          {showEditor && (
            <button onClick={onSaveContent} className="save-button">Save</button>
          )}
        </div>
      </header>
      <p className='align-left'>Created by username on date</p>
      <div className="editorpage-content">
        <div className="text-and-display-container">
          <section className="text-container">
            <p>table of contents</p>
            {showEditor ? (
              <div className="editor-container">
                <Editor
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                  toolbar={toolbarOptions}
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
            ) : (
              <div className="page-content" dangerouslySetInnerHTML={createMarkup(pageContent)}></div>
            )}
          </section>
          <div className="silly-dog-display-container">
            <SillyDogDisplay /*dog={dogData}*/ />
          </div>
        </div>
      </div>
    </ContentContainer>
  );      
};

export default CreateDogPage;