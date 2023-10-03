import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing">
      <div className="left">
        <div className="logo">
          <img src="logo.png" />
        </div>

        <div className="title-large">NIS</div>
        <div className="title-large">New System</div>
        <div className="title-small">the future of school</div>

        <div className="button-wrapper">
          <Link to="/login">
            <button className="button-black">Login</button>
          </Link>

          <Link to="/view">
            <button>View Votes</button>
          </Link>

          <Link to="/famlogin">
            <button>Family</button>
            </Link>
        </div>
      </div>

      <div className="right">
        <img src="NIS.png" width="800" height ="800"/>
      </div>
    </div>
  );
};

export default Landing;
