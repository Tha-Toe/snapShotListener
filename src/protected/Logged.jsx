import React from "react";
import { Navigate } from "react-router-dom";
export default function Logged({ children, userDetail }) {
  if (userDetail) {
    return <Navigate to="/home" />;
  } else {
    return children;
  }
}
