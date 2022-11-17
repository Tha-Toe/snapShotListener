import { useRef, useState, useEffect } from "react";
import "./App.css";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import Home from "./component/Home";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { APIURLs } from "./api/ApiUrls";
import { makeGETAPICall } from "./api/methods";
export const getUserInfoFromFirebaseUser = (firUser, fullName) => ({
  uid: firUser.uid,
  name: firUser.displayName || fullName,
  email: firUser.email,
  emailVerified: firUser.emailVerified,
  phoneNumber: firUser.phoneNumber,
  picture: firUser.photoURL,
  providerId: firUser.providerId,
  username: firUser.userName,
  firstNameLetter: firUser.firstNameLetter,
});

function App() {
  const [userDetail, setUserDetail] = useState(null);
  //firebase user login state change
  useEffect(() => {
    const firebaseUser = onAuthStateChanged(auth, async (currentUser) => {
      console.log(currentUser);
      if (currentUser) {
        var firUser = getUserInfoFromFirebaseUser(
          currentUser,
          currentUser.displayName
        );
        if (firUser.uid) {
          console.log(firUser.uid);
          getUserById(firUser.uid)
            .then((result) => {
              if (result) {
                localStorage.setItem("user", JSON.stringify(firUser));
                setUserDetail(result);
                console.log("user detail", result);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });
    return () => {
      firebaseUser();
    };
  }, []);

  //sign in google

  const googleSignIn = async () => {
    const googleProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, googleProvider);
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <button
                  onClick={handleGoogleLogin}
                  style={{ marginTop: "200px" }}
                >
                  Login with Google
                </button>
                <button
                  onClick={() => {
                    signOut(auth);
                  }}
                  style={{ marginTop: "200px" }}
                >
                  Logout
                </button>
              </div>
            }
          />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export const getUserById = async (userId) => {
  var apiUrl = APIURLs.getUserInfo;
  apiUrl = apiUrl.replace("{userId}", userId);
  const apiResponse = await makeGETAPICall(apiUrl);
  if (apiResponse.status === 200) {
    return apiResponse.data;
  } else {
    return null;
  }
};
export default App;
