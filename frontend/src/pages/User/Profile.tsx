import React, { useContext, useState, useEffect } from "react";
import { RouteProps } from "react-router";
import { AuthContext } from "../../contexts/Auth";
import axios from "../../axios";

type User = {
  FirstName: string
  LastName: string
  citizenshipNumber: string
  SubjectName: string
  CuratorName: string
}

const Profile = (props: RouteProps) => {
  const authContext = useContext(AuthContext);
  const [students, setStudentData] = useState<User[]>([]);

  useEffect(() => {

    axios
      .get(`/selection/getstudents?authnumber=${authContext.citizenshipNumber}`)
      .then((res) => {
        setStudentData(res.data.curators)
      })
      .catch((err) => {
        console.log('Error fetching existing curators names', err)
      });

  }, []);


  console.log({ authContext });

  return (
    <div className="profile-wrapper">
      <div className="left-panel">
        <div className="person-icon">
          <i className="bi bi-person-circle"></i>
        </div>
        <div className="text-normal username">{authContext.FirstName} {authContext.LastName} </div>
        <button onClick={authContext.logout} className="button-primary">
          Logout
        </button>
      </div>

      <div className="right-panel">
        <span className="title-small">Profile</span>
        {students.map((student) => (
                    <div className="skeleton">Curator: {student.CuratorName}</div>
                  ))}
        
      </div>
    </div>
  );
};

export default Profile;
