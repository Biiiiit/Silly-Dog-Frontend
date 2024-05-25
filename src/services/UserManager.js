import axios from "axios";
import TokenManager from "./TokenManager";

const url = `${process.env.REACT_APP_API_LINK}/signin`;

const signin = async (username, password) => {
  return axios
    .post(url, { username, password })
    .then((response) => response.data.token)
    .then((token) => TokenManager.setAccessToken(token));
};

export default {
  signin,
};
