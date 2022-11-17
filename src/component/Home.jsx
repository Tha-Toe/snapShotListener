import React from "react";
import {
  doc,
  getDocs,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";
import { APIURLs } from "../api/ApiUrls";
import { makeGETAPICall } from "../api/methods";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../firebase";
import { connectStorageEmulator } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function Home({ setUserDetail, userDetail }) {
  let navigate = useNavigate();
  const [sports, setSports] = useState([]);

  //get sports data
  useEffect(() => {
    const getSportsData = ({ userDetail }) => {
      if (userDetail) {
        onSportsCounterUpdate({ setSports });
      }
    };
    getSportsData({ userDetail });
  }, [userDetail]);

  return (
    <div>
      <div style={{ marginTop: "200px" }}>Home Page</div>
      <button
        onClick={() => {
          setUserDetail(null);
          localStorage.clear();
          signOut(auth);
          navigate("/", { replace: true });
        }}
      >
        Logout
      </button>
    </div>
  );
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

export const onSportsCounterUpdate = async ({ setSports }) => {
  const q = query(collection(db, "sports_counter"));
  onSnapshot(q, (querySnapshot) => {
    var allsports = [];
    getAllSports()
      .then((result) => {
        if (result) {
          if (result.length > 0) {
            result.forEach((x) => {
              if (x.code !== "home" && x.activeSw) {
                allsports.push(x);
              }
            });
          }
          setSports(allsports);
          localStorage.setItem("all_sports", JSON.stringify(result));
        } else {
          // console.log("null");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
