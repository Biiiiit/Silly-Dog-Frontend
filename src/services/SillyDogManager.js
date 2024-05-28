import axios from "axios";

const url = "https://graceful-wylma-silly-dog-wiki-1906a282.koyeb.app/sillyDogs";
// Make sure to set the Content-Type header to application/json
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Get one
const getSillyDog = async (name) => {
  try {
    // Step 1: Fetch SillyDogEntity
    const sillyDogResponse = await axios.get(`${url}/${name}`);
    
    if (sillyDogResponse.data) {
      const sillyDog = sillyDogResponse.data;
      
      // Step 2: Fetch associated PageContentEntity
      const pageContentResponse = await axios.get(`${url}/${sillyDog.id}/pagecontent`);
      
      if (pageContentResponse.data) {
        sillyDog.pageContent = pageContentResponse;
      }
      
      return sillyDog;
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error fetching dog info:", error);
    return null;
  }
};

// Get all
const getManySillyDogs = async () => {
  return await axios.get(url).then((response) => response.data);
};

const saveSillyDog = async (name) => {
  const data = { name }; // Create a JSON object with the name property
  return await axios.post(url, data).then((response) => response.data);
};

const savePageContent = async (pageContent, sillyDogId) => {
  const url = `https://graceful-wylma-silly-dog-wiki-1906a282.koyeb.app/sillyDogs/${sillyDogId}/pagecontent`;

  try {
    const response = await axios.post(url, pageContent, {
      headers: {
        'Content-Type': 'application/json',
      },s      
    });
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error saving page content:', error);
    throw error;
  }
};

const getPageContent = async (sillyDogId) => {
  const url = `https://graceful-wylma-silly-dog-wiki-1906a282.koyeb.app/sillyDogs/${sillyDogId}/pagecontent`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error getting page content:', error);
    throw error;
  }
};

const updatePageContent = async (id, updatePageContentRequest) => {
  console.log(updatePageContentRequest);
  try {
    
    // Make the PUT request with the updated request object
    await axios.put(`${url}/${id}/pagecontent`, updatePageContentRequest).then((response) => response.data);
    
    return; // No need to return anything upon successful update
  } catch (error) {
    // Handle error
    console.error('Error updating page content:', error);
    throw error;
  }
};

// Delete
const deleteSillyDog = async (id) => {
  return await axios.delete(`${url}/${id}`);
};

// Update
const updateSillyDog = async (id, updatedDogInfo) => {
  return await axios.put(`${url}/${id}`, updatedDogInfo).then((response) => response.data);
};

export default {
  getSillyDog,
  getManySillyDogs,
  saveSillyDog,
  deleteSillyDog,
  updateSillyDog,
  updatePageContent,
  getPageContent,
  savePageContent,
};
