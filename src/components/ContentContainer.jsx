import React from 'react';
import "./css/ContentContainer.css"

const ContentContainer = ({ children }) => {
  return (
    <div className="content-container">
      <div className="content">{children}</div>
    </div>
  );
};

export default ContentContainer;
