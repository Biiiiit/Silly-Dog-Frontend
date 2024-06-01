import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SillyDogManager from "../services/SillyDogManager";
import "./css/ViewSillyDogs.css";

const ViewSillyDogPage = () => {
  const { name } = useParams(); // Get the dog name from the URL parameters
  const [dog, setDog] = useState(null);
  const [pageContent, setPageContent] = useState("");

  useEffect(() => {
    const fetchSillyDog = async () => {
      try {
        // Fetch the Silly Dog details by name
        const fetchedDog = await SillyDogManager.getSillyDogByName(name);
        if (fetchedDog) {
          setDog(fetchedDog);

          // Fetch the page content for the Silly Dog
          const content = await SillyDogManager.getPageContent(fetchedDog.id);
          setPageContent(content || "<h1>No description available</h1>");
        } else {
          console.error("Silly Dog not found");
        }
      } catch (error) {
        console.error("Error fetching Silly Dog:", error);
      }
    };

    fetchSillyDog();
  }, [name]);

  return (
    <div className="view-silly-dog-page">
      {dog ? (
        <div className="silly-dog-details">
          <h1>{dog.name}</h1>
          <div dangerouslySetInnerHTML={{ __html: pageContent }} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewSillyDogPage;
