import React, { useState, useEffect } from 'react';

const ErrorDisplay = ({ errorCode }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = `https://http.dog/${errorCode}.webp`;
        const response = await fetch(url);
        if (response.ok) {
          setImageUrl(url);
        } else {
          setImageUrl('https://http.dog/500.webp'); // fallback image for unknown error codes
        }
      } catch {
        setImageUrl('https://http.dog/500.webp'); // fallback image for network errors
      }
    };

    fetchImage();
  }, [errorCode]);

  return (
    <div>
      <h1>Error: {errorCode}</h1>
      {imageUrl && <img src={imageUrl} alt={`Error ${errorCode}`} />}
    </div>
  );
};

export default ErrorDisplay;
