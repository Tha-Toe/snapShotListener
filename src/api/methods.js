import { auth } from "../firebase";
import { setAxiosConfig } from "./AxiosConfig";
const axios = require("axios").default;
//GET METHOD
export const makeGETAPICall = async (url, additionalHeaders) => {
  try {
    const idToken = await auth.currentUser.getIdToken(true);
    console.log(idToken);
    console.log(url);
    if (idToken && axios) {
      const apiResponse = await axios.get(
        url,
        setAxiosConfig(
          idToken,
          additionalHeaders ? additionalHeaders : undefined
        )
      );
      console.log(apiResponse, "api response");
      return apiResponse;
    } else {
      throw new Error("Error occurred, please login again to continue");
    }
  } catch (error) {
    console.log("makeGETAPICall newapicall", error, url);
    throw error;
  }
};
