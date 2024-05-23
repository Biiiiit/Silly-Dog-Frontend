import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ContentContainer from "../components/ContentContainer";
import { AtomicBlockUtils } from "draft-js";
import {
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import { convertToHTML } from "draft-convert";
import ReactDOM from "react-dom/client";
import parse from "html-react-parser";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./css/CreateSillyDog.css";
import "./css/Editor.css";
import CustomLinkModal from "../components/CustomLinkModal";
import SillyDogDisplay from "../components/SillyDogDisplayer";
import SillyDogEdit from "../components/SillyDogEdit";
import SillyDogImage from "../assets/SillyDoggy.png";
import SillyDogManager from "../services/SillyDogManager";

const CreateDogPage = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [showEditor, setShowEditor] = useState(false);
  const [pageContent, setPageContent] = useState("placeholder for text");
  const [showCustomLinkModal, setShowCustomLinkModal] = useState(false); // Define showCustomLinkModal state variable
  const [dogInfo, setDogInfo] = useState({}); // Initialize dogInfo state
  const [isDogInfoEmpty, setIsDogInfoEmpty] = useState(true); // Initialize isDogInfoEmpty state
  const [showEditModal, setShowEditModal] = useState(false);
  const { name } = useParams(); // Get the inputData from URL parameters

  const defaultDogInfo = {
    image: SillyDogImage, // Empty image URL
    name: name,
    description: "", // Empty description
    status: "", // Empty status
    nationality: "", // Empty nationality
    aliases: [], // Empty aliases array
    relatives: [], // Empty relatives array
    affiliation: [],
    occupation: "", // Empty occupation
    dateOfBirth: "", // Empty date of birth
    placeOfBirth: "", // Empty place of birth
    maritalStatus: "", // Empty marital status
    gender: "", // Empty gender
    height: "", // Empty height
    weight: "", // Empty weight
    media: [],
  };

  const handleSillyDogDisplayClick = () => {
    // Open SillyDogEdit modal when SillyDogDisplay is clicked
    console.log(showEditModal);
    setShowEditModal(true);
  };

  useEffect(() => {
    const editorContainer = document.querySelector('.DraftEditor-root');
    const handleDocumentClick = (event) => {
      let target = event.target;
      // Traverse up the DOM tree until we find a div with class "silly-dog-display" or reach the editor container
      while (target && !target.classList.contains('silly-dog-display') && target !== editorContainer) {
        target = target.parentElement;
      }
      // If a div with class "silly-dog-display" is found, trigger its click event
      if (target && target.classList.contains('silly-dog-display')) {
        handleSillyDogDisplayClick();
      }
    };
    // Attach the event listener to the document
    document.addEventListener('click', handleDocumentClick);
    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleSillyDogDisplayClick]); // Run this effect whenever handleSillyDogDisplayClick changes

  useEffect(() => {
    let nameDecoded = decodeURIComponent(name.replace(/\+/g, " "));
    // Fetch dog info when component mounts or name changes
    SillyDogManager.getSillyDog(nameDecoded)
      .then((fetchedDogInfo) => {
        const dogData = fetchedDogInfo || defaultDogInfo;
        console.log("Dog Info:", dogData);
        const isEmpty = Object.values(dogData).some((value) => value === "");
        console.log("Is dog info empty?", isEmpty);
        // Update the dogInfo state and isDogInfoEmpty state here
        setDogInfo(dogData);
        setIsDogInfoEmpty(isEmpty);
      })
      .catch((error) => {
        console.error("Error fetching dog info:", error);
        // Handle error if necessary
        // Set dogInfo to default if there's an error
        setDogInfo(defaultDogInfo);
        // Set isDogInfoEmpty to true if there's an error
        setIsDogInfoEmpty(true);
      });
  }, [name]); // Fetch dog info whenever name changes

  useEffect(() => {
    // Function to append SillyDogDisplay component to the editor container
    const appendSillyDogDisplayToEditor = () => {
      // Find the editor container
      const editorContainer = document.querySelector('[data-contents="true"]');
      // Check if the editor container exists
      if (editorContainer) {
        // Create a root for rendering SillyDogDisplay component
        const sillyDogDisplayRoot = document.createElement("div");
        sillyDogDisplayRoot.className = 'default-div'; // Set class name
  
        // Render SillyDogDisplay component to the root
        const sillyDogDisplayRootInstance = ReactDOM.createRoot(sillyDogDisplayRoot);
        sillyDogDisplayRootInstance.render(
          <SillyDogDisplay dogInfo={dogInfo} onClick={handleSillyDogDisplayClick} />
        );
  
        // Get the first child of the editor container
        const firstChild = editorContainer.firstChild;
  
        // Insert the root before the first child
        editorContainer.insertBefore(sillyDogDisplayRoot, firstChild);
      }
    };
  
    // Check if the editor is open and then append SillyDogDisplay component
    if (showEditor && !isDogInfoEmpty) {
      // Only append if showEditor is true and dogInfo is not empty
      appendSillyDogDisplayToEditor();
    }
  
    // Clean up event listener when component unmounts or when dependencies change
    return () => {
      const editorContainer = document.querySelector('[data-contents="true"]');
      if (editorContainer) {
        const sillyDogDisplayRoot = editorContainer.querySelector('.default-div');
        if (sillyDogDisplayRoot) {
          sillyDogDisplayRoot.remove(); // Remove the SillyDogDisplay component when unmounting
        }
      }
    };
  }, [showEditor, isDogInfoEmpty, dogInfo]); // Run this effect whenever showEditor, isDogInfoEmpty, or dogInfo changes
  
  
  const toggleEditor = () => {
    setShowEditor(!showEditor);
  
    // Load page content into editor when toggling
    if (!showEditor) {
      console.log("Editor opened, showEditor is now true");
      // Replace <br> tags with a unique marker
      const contentWithMarker = pageContent.replace(/<br\s*\/?>/gi, "[[BR]]");
  
      // Convert the modified HTML content to EditorState
      const blocksFromHTML = convertFromHTML(contentWithMarker);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      const editorState = EditorState.createWithContent(contentState);
  
      // Replace the marker with a special character that represents a single empty line
      const currentContent = editorState.getCurrentContent();
      const rawContentState = convertToRaw(currentContent);
      const updatedBlocks = rawContentState.blocks.map((block) => ({
        ...block,
        text: block.text.replace(/\[\[BR\]\]/g, "\n"), // Replace the marker with newline character
      }));
      const updatedContentState = convertFromRaw({
        ...rawContentState,
        blocks: updatedBlocks,
      });
      const updatedEditorState =
        EditorState.createWithContent(updatedContentState);
  
      setEditorState(updatedEditorState);
    }
  };  

  const onSaveContent = () => {
    // Get the current content state
    const contentState = editorState.getCurrentContent();

    // Convert the content state to HTML with link entities properly converted
    let html = convertToHTML({
      entityToHTML: (entity, originalText) => {
        if (entity.type === "LINK") {
          return `<a href="${entity.data.url}" title="${entity.data.title}" target="_blank">${originalText}</a>`;
        }
        return originalText;
      },
    })(contentState);

    // Replace all <p><br/></p> with <br>
    html = html.replace(/<p><br\s*\/?><\/p>/g, "<br>");

    // Replace remaining <p> tags with a single <br> each
    html = html.replace(/<p>/g, "<br>");

    console.log(html); // Log the HTML to check if it's correct

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

const openCustomLinkModal = () => {
    setShowCustomLinkModal(true);
  };

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.classList && node.classList.contains("rdw-link-modal")) {
              // Hide the default link modal
              node.style.display = "none";
  
              // Prevent the default modal from closing automatically
              node.addEventListener("click", (e) => {
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
        linkButtonWrapper.addEventListener("click", openCustomLinkModal);
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
        linkButtonWrapper.removeEventListener("click", openCustomLinkModal);
      }
      observer.disconnect(); // Disconnect the MutationObserver
    };
  }, [openCustomLinkModal]); // Ensure the effect depends on openCustomLinkModal  

  // Add event listener to the default link button wrapper outside of toggle functions
  document.addEventListener("click", function (event) {
    // Check if the clicked element is the default link button
    if (
      event.target.classList.contains("rdw-option-wrapper") &&
      event.target.getAttribute("title") === "Link"
    ) {
      handleDefaultLinkButtonClick();
    }
  });

  const handleDefaultLinkButtonClick = () => {
    openCustomLinkModal();
  };

  const handleCloseModal = () => {
    setShowCustomLinkModal(false);
  };

  const updateDogInfo = (newDogInfo) => {
    setDogInfo(newDogInfo);
  };

  const onCloseEditor = () => {
    setShowEditor(false);
  };

  const handleAddLink = (url, title) => {
    // Get the current editor state
    let currentEditorState = editorState;

    // Create a new entity for the link
    const contentStateWithEntity = currentEditorState
      .getCurrentContent()
      .createEntity("LINK", "MUTABLE", { url, title });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    // Insert the link entity as an atomic block at the current selection
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      currentEditorState,
      entityKey,
      url
    );

    // Update the editor state
    setEditorState(newEditorState);

    // Close the custom link modal
    handleCloseModal();
  };

  // Custom toolbar options
  const toolbarOptions = {
    options: [
      "history",
      "inline",
      "blockType",
      "list",
      "textAlign",
      "link",
    ],
    history: {
      inDropdown: false,
      options: ["undo", "redo"],
    },
    blockType: {
      inDropdown: true,
      options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6", "Blockquote"],
    },
    inline: {
      inDropdown: false,
      options: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "superscript",
        "subscript",
      ],
    },
    list: {
      inDropdown: false,
      options: ["unordered", "ordered"],
    },
    textAlign: {
      inDropdown: true,
      options: ["left", "center", "right", "justify"],
    },
    link: {
      inDropdown: false,
      // onClick: handleOpenCustomLinkModal, // Changed from openCustomLinkModal to handleOpenCustomLinkModal
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
        <h1 className="name">{name}</h1>
        <div className="button-container">
          <button onClick={toggleEditor} className="edit-button">
            {showEditor ? "Hide Editor" : "Edit"}
          </button>
          {showEditor && (
            <button onClick={onSaveContent} className="save-button">
              Save
            </button>
          )}
        </div>
      </header>
      <p className="align-left">Created by username on date</p>
      <div className="editorpage-content">
        <div className="text-and-display-container">
          <section className="text-container">
            <p className="align-left">table of contents</p>
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
                    const newState = RichUtils.handleKeyCommand(
                      editorState,
                      command
                    );
                    if (newState) {
                      onEditorStateChange(newState);
                      return "handled";
                    }
                    return "not-handled";
                  }}
                />
              </div>
            ) : (
              <div>
                <div className="page-content">
                  {!isDogInfoEmpty && dogInfo && (
                    <SillyDogDisplay dogInfo={dogInfo} />
                  )}
                  <p>{parse(pageContent)}</p>
                </div>
              </div>
            )}
          </section>
          {(showEditor && isDogInfoEmpty) || showEditModal ? (
            <SillyDogEdit dogInfo={dogInfo} onUpdateDogInfo={updateDogInfo} onClose={() => setShowEditModal(false)} />
          ) : null}
        </div>
      </div>
    </ContentContainer>
  );
};

export default CreateDogPage;
