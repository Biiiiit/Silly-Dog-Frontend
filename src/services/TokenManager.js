import { jwtDecode } from "jwt-decode";

function getAccessToken() { return sessionStorage.getItem("accessToken"); }

function getClaims() {
    if (!sessionStorage.getItem("claims")) {
        return undefined;
    }
    return JSON.parse(sessionStorage.getItem("claims"));
}

function setAccessToken(token) {
    sessionStorage.setItem("accessToken", token);
    const claims = jwtDecode(token);
    sessionStorage.setItem("claims", JSON.stringify(claims));
    return claims;
}

function clear() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("claims");
}


export default {
    getAccessToken,
    getClaims,
    setAccessToken,
    clear
};