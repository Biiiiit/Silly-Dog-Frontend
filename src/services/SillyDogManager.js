import axios from "axios";

const url = "https://silly-dog-wiki.vercel.app/sillyDogs";
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
  const data = {
    image: "", // Empty image URL
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
  return await axios.post(url, data).then((response) => response.data);
};

const savePageContent = async (pageContent, sillyDogId) => {
  const url = `https://silly-dog-wiki.vercel.app/sillyDogs/${sillyDogId}/pagecontent`;

  try {
    const requestData = {
      content: pageContent,
      sillyDogId: sillyDogId // Include the sillyDogId in the JSON object
    };

    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error saving page content:', error);
    throw error;
  }
};

const getPageContent = async (sillyDogId) => {
  const url = `https://silly-dog-wiki.vercel.app/sillyDogs/${sillyDogId}/pagecontent`;
  
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
