import React from 'react';
import "./css/ContentContainer.css"

const ContentContainer = ({ children }) => {
  return (
    <div className="content-container">
      {children}
    </div>
  );
};

export default ContentContainer;
