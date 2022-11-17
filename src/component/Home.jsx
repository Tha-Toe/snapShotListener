import React from "react";
import {
  doc,
  getDocs,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";

import { APIURLs } from "../api/ApiUrls";
import { makeGETAPICall } from "../api/methods";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../firebase";
import { connectStorageEmulator } from "firebase/storage";

export default function Home() {
  return <div>Home</div>;
}
export const getAllSports = async () => {
  var apiUrl = APIURLs.getAllSports;
  console.log(apiUrl);
  const apiResponse = await makeGETAPICall(apiUrl); //[{"Access-Control-Allow-Origin":"*"},{"Access-Control-Allow-Headers":"*"}]
  if (apiResponse.status === 200) {
    return apiResponse.data;
  } else {
    return null;
  }
};
