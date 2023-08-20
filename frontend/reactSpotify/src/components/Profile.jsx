import { React, useState, useEffect } from "react";
import NavigationBar from "./Navbar";
import axios from "axios";
import Switch from "react-switch";
import { BsFillLockFill, BsFillUnlockFill } from "react-icons/bs";
import { useContext } from "react";
import { AppStateContext } from "../AppState";
import { Helmet } from "react-helmet";
export default function Profile() {
  const { appState, setAppState } = useContext(AppStateContext);
  let email = appState.user;
  if (!appState.user) {
    email = localStorage.getItem("email");
  }
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const handleSwitch = async (e) => {
    setIsPublic(e);
    try {
      const response = await axios.post(
        `http://localhost:3000/RouterOne/update_privacy`,
        {
          email: email,
          isPublic: isPublic,
        }
      );
    } catch (error) {
      console.error(error); // Handle any errors that occur
    }
  };
  const getProfile = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/RouterOne/profile`, {
        email: email,
      });
      setName(response.data.result.name);
      localStorage.setItem("userName",response.data.result.name)
      setIsPublic(response.data.result.isPublic);
      setImage(response.data.result.image);
    } catch (error) {
      console.error(error); // Handle any errors that occur
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="view-container">
        <NavigationBar page="profile" />
        <h1 className="white-text">My Profile</h1>
        <div className="top-card">
          <img src={image} style={{ marginBottom: "0px" }} />
        </div>

        <div className="cards-container">
          <div className="top-card">
            <h2 className="white-text">Display Name:</h2>
            <div
              className="shadow-container"
              style={{
                marginTop: "10px",
                padding: "5px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h3>{name}</h3>
            </div>
          </div>

          <div className="top-card">
            <h2 className="white-text">Email:</h2>
            <div
              className="shadow-container"
              style={{
                marginTop: "10px",
                padding: "5px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h3>{email}</h3>
            </div>
          </div>

          <div className="top-card">
            {isPublic ? (
              <h2 className="white-text">
                <BsFillUnlockFill /> Public Profile
              </h2>
            ) : (
              <h2 className="white-text">
                <BsFillLockFill /> Private Profile
              </h2>
            )}
            <Switch checked={isPublic} onChange={handleSwitch} />
            <div
              className="shadow-container"
              style={{ marginTop: "10px", padding: "5px" }}
            >
              <h5 className="white-text" style={{ marginTop: "10px" }}>
                When your profile is public, other users can see your name, top
                songs, top artists, and liked songs on the discover page
              </h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
