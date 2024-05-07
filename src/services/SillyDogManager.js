import axios from "axios";

const url = "http://localhost:8080/sillyDogs";

// Get one
const getSillyDog = async (name) => {
  try {
    const response = await axios.get(`${url}/${name}`);
    // Check if response contains data
    if (response.data) {
      return response.data;
    } else {
      // Return an empty object if response data is empty
      return {};
    }
  } catch (error) {
    // Handle errors by returning null
    console.error("Error fetching dog info:", error);
    return null;
  }
};

// Get all
const getManySillyDogs = async () => {
  return await axios.get(url).then((response) => response.data);
};

// Save
const saveSillyDog = async (sillyDog) => {
  return await axios.post(url, sillyDog).then((response) => response.data);
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
};
