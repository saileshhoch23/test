import React from "react";
import { Navigate } from "react-router-dom";
import AppStore from "../../redux/store";
export const PrivetRoute = ({children}) => {
  const token = AppStore.store.getState().token;
  return token ? children : <Navigate to="/login" />
};


export const PublicRoute = ({children}) =>{
    const token = AppStore.store.getState().token;
  if (token) {
    return <Navigate to="/" />;
  }

  return children;
}