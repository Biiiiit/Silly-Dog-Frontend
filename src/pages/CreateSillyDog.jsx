import React, { useState } from 'react';
import ContentContainer from '../components/ContentContainer';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './css/CreateSillyDog.css';

const CreateDogPage = () => {
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
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
            />
          </div>
          <button onClick={() => console.log(convertToRaw(editorState.getCurrentContent()))}>
            Log Content State
          </button>
        </div>
      </div>
    </ContentContainer>
  );
};

export default CreateDogPage;
