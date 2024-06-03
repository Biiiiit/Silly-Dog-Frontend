import React, { useState, useEffect } from "react";
import "./ErrorDisplay.css";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import errorCodes from "/src/assets/error_codes_document.txt";

const ErrorDisplay = ({ errorCode, onClose }) => {
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [backgroundClass, setBackgroundClass] = useState("");
  const [tooltipText, setTooltipText] = useState("");

  // Custom tooltip component with the desired styles
  const CustomHtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      opacity: 1,
      backgroundColor: "#006992",
      color: "white",
      disableInteractive: false,
      padding: "10px",
      borderRadius: "5px",
      placement: "left-start",
      border: "2px solid black",
    },
  }));

  useEffect(() => {
    // Function to parse the document and extract tooltip text for the given error code
    const extractTooltipText = (documentContent) => {
      const lines = documentContent.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(errorCode)) {
          // Assuming each error code is followed by its tooltip text on the same line
          const tooltipLine = lines[i];
          const tooltipParts = tooltipLine.split(":");
          if (tooltipParts.length > 1) {
            // Extract tooltip text after the error code
            const tooltip = tooltipParts.slice(1).join(":").trim();
            setTooltipText(tooltip);
            return;
          }
        }
      }
      // If tooltip text not found for the error code
      setTooltipText("Tooltip text not found for this error code");
    };

    // Fetch the document content and extract tooltip text
    const fetchDocumentAndExtractText = async () => {
      try {
        const response = await fetch(errorCodes);
        if (response.ok) {
          const documentContent = await response.text();
          extractTooltipText(documentContent);
        } else {
          setTooltipText("Error fetching document content");
        }
      } catch (error) {
        console.error("Error fetching document content:", error);
        setTooltipText("Error fetching document content");
      }
    };

    fetchDocumentAndExtractText();
  }, [errorCode]);

  useEffect(() => {
    const fetchAndProcessImage = async () => {
      try {
        const url = `https://http.dog/${errorCode}.webp`;
        const response = await fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();
          img.crossOrigin = "Anonymous"; // Enable CORS for the image
          img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0);
            // Overlay a black square at the top-left corner
            ctx.fillStyle = "black";
            ctx.fillRect(canvas.width - 370, 0, 400, 50); // Adjust size of black square as needed
            // Convert the canvas content to a data URL
            const processedUrl = canvas.toDataURL();
            setBackgroundUrl(processedUrl);
            URL.revokeObjectURL(objectUrl);
          };
          img.src = objectUrl;
        } else {
          setBackgroundUrl("https://http.dog/500.webp"); // fallback image for unknown error codes
        }
      } catch {
        setBackgroundUrl("https://http.dog/500.webp"); // fallback image for network errors
      }
    };

    fetchAndProcessImage();
  }, [errorCode]);

  useEffect(() => {
    if (backgroundUrl) {
      const className = `bg-image-${errorCode}`;
      const styleSheet = document.styleSheets[0];
      const rule = `.${className} { background-image: url(${backgroundUrl}); }`;
      styleSheet.insertRule(rule, styleSheet.cssRules.length);
      setBackgroundClass(className);
    }
  }, [backgroundUrl, errorCode]);

  return (
    <CustomHtmlTooltip
      title={
        <React.Fragment>
          <div style={{ color: "white", fontWeight: "bold" }}>
            Error Code: {errorCode}
          </div>
          <div>{tooltipText}</div>
        </React.Fragment>
      }
      followCursor
    >
      <div className={`errorDisplay ${backgroundClass}`} onClick={onClose}>
        <div className="errorPopup">
          <h2>
            Oh no, an error occurred. Don't worry, here is some relevant
            information.
          </h2>
          <p>(Click anywhere to dismiss)</p>
        </div>
      </div>
    </CustomHtmlTooltip>
  );
};

export default ErrorDisplay;
