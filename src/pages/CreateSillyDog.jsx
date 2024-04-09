import React, { useState, useEffect } from 'react';
import ContentContainer from '../components/ContentContainer';
import { EditorState, RichUtils } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './css/CreateSillyDog.css';
import { FaTextHeight, FaAngleDown } from 'react-icons/fa'; // Import required icons

const CreateDogPage = () => {
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
  const [convertedContent, setConvertedContent] = useState(null);

  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(html);
  }, [editorState]);

  console.log(convertedContent);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
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
      inDropdown: true,
    },
    embedded: {
      inDropdown: false,
      options: ['link', 'image', 'video'],
    },
    // Custom button with dropdown
    toolbarCustomButtons: [
      <div className="custom-toolbar-button" key="custom-button">
        <FaAngleDown /> {/* Arrow pointing down */}
      </div>,
    ],
  };

  return (
    <ContentContainer>
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
