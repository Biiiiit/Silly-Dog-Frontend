import axios from "axios";

const url = "localhost:8080/sillyDogs";

// Get one
const getSillyDog = async (id) => {
  return await axios.get(`${url}/${id}`).then((response) => response.data);
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

export default {
  getSillyDog,
  getManySillyDogs,
  saveSillyDog,
  deleteSillyDog,
};
