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
  const { name } = useParams(); // Get the inputData from URL parameters

  const defaultDogInfo = {
    image: SillyDogImage, // Empty image URL
    name: name,
    description: "", // Empty description
    status: "", // Empty status
    nationality: "", // Empty nationality
    aliases: [], // Empty aliases array
    relatives: [], // Empty relatives array
    affiliations: [],
    occupation: "", // Empty occupation
    dateOfBirth: "", // Empty date of birth
    placeOfBirth: "", // Empty place of birth
    maritalStatus: "", // Empty marital status
    gender: "", // Empty gender
    height: "", // Empty height
    weight: "", // Empty weight
    media: [],
  };

  useEffect(() => {
    // Fetch dog info when component mounts or name changes
    SillyDogManager.getSillyDog(name)
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

  // Log the dogInfo object
  console.log("Dog Info:", dogInfo);

  useEffect(() => {
    // Function to append SillyDogDisplay component to the editor container
    const appendSillyDogDisplayToEditor = () => {
      // Find the editor container
      const editorContainer = document.querySelector('[data-contents="true"]');
      // Check if the editor container exists
      if (editorContainer) {
        // Create a root for rendering SillyDogDisplay component
        const sillyDogDisplayRoot = document.createElement("div");
        // Render SillyDogDisplay component to the root
        const sillyDogDisplayRootInstance =
          ReactDOM.createRoot(sillyDogDisplayRoot);
        sillyDogDisplayRootInstance.render(
          <SillyDogDisplay /*dog={dogData}*/ />
        );

        // Check if the editor container already has children
        if (editorContainer.firstChild) {
          // Insert SillyDogDisplay as the first child of the editorContainer
          editorContainer.insertBefore(
            sillyDogDisplayRoot,
            editorContainer.firstChild
          );
        } else {
          // If no children exist, simply append SillyDogDisplay to the editorContainer
          editorContainer.appendChild(sillyDogDisplayRoot);
        }
      }
    };

    // Check if the editor is open and then append SillyDogDisplay component
    if (showEditor && !isDogInfoEmpty) {
      // Only append if showEditor is true and dogInfo is not empty
      appendSillyDogDisplayToEditor();
    }
  }, [showEditor, isDogInfoEmpty]); // Run this effect whenever showEditor or dogInfo changes

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

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Check if a new .rdw-link-modal element is added to the DOM
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
      const linkButtonWrapper = document.querySelector(
        '.rdw-option-wrapper[title="Link"]'
      );
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
      const linkButtonWrapper = document.querySelector(
        '.rdw-option-wrapper[title="Link"]'
      );
      if (linkButtonWrapper) {
        linkButtonWrapper.removeEventListener("click", openCustomLinkModal);
      }
    };
  }, []);

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

  const openCustomLinkModal = () => {
    setShowCustomLinkModal(true);
  };

  const handleCloseModal = () => {
    setShowCustomLinkModal(false);
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
      "embedded",
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
    embedded: {
      inDropdown: false,
      options: ["link", "image", "video"],
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
                  {!isDogInfoEmpty && dogInfo && <SillyDogDisplay dogInfo={dogInfo} />}
                  <p>{parse(pageContent)}</p>
                </div>
              </div>
            )}
          </section>
          {showEditor && isDogInfoEmpty && (
            <SillyDogEdit dogInfo={dogInfo} onClose={onCloseEditor} />
          )}
        </div>
      </div>
    </ContentContainer>
  );
};

export default CreateDogPage;
