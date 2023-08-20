import React from "react";
import NavigationBar from "./Navbar";
import { useContext } from "react";
import { AppStateContext } from "../AppState";


export default function HomeSY() {
  const { appState, setAppState } = useContext(AppStateContext);
  let email = appState.user;
  if (!appState.user) {
    email = localStorage.getItem("email")

  }
  return (
    <>
      <NavigationBar />
      <div>
        <h1>Home</h1>
        <p>email: {email}</p>
      </div>
    </>
  );
}
