import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../../../../Nis/frontend/src/pages/Home";
import Login from "../../../../Nis/frontend/src/pages/Login";
import Signup from "../../../../Nis/frontend/src/pages/Signup";
import View from "../../../../Nis/frontend/src/pages/View";
import { AuthContext } from "../../../../Nis/frontend/src/contexts/Auth";
import UserPollsPage from "../../../../Nis/frontend/src/pages/User/Polls";
import HomePage from "../../../../Nis/frontend/src/pages/Admin/Home";
import ProfilePage from "../../../../Nis/frontend/src/pages/User/Profile";
import Default from "../layouts/Default";
import AdminUsersPage from "../../../../Nis/frontend/src/pages/Admin/Users";
import AdminVerifyPage from "../../../../Nis/frontend/src/pages/Admin/Verify";
import ChoicePage from "../../../../Nis/frontend/src/pages/User/Choice";
import FeedbackPage from "../../../../Nis/frontend/src/pages/User/feedback";
import ChatPage from "../../../../Nis/frontend/src/pages/User/Chat";
import Signupfam from "../../../../Nis/frontend/src/pages/famSignup";
import LoginFam from "../../../../Nis/frontend/src/pages/famLogin";
import Famhome from "../pages/Family/Famhome";
import Famgoal from "../pages/Family/Famgaol";
import Famelection from "../pages/Family/Famelection";
import Famadd from "../pages/Family/Famadd";
import Famtask from "../pages/Family/Task";


export default () => {
  const authContext = useContext(AuthContext);

  const getRoutes = (): JSX.Element => {
    if (authContext.loading) return <div>loading...</div>;
    if (authContext.authenticated) {
      // if the user is authenticated then

      const adminMenu = [
        { name: "Home", link: "/" },
        { name: "Verify Users", link: "/users" },
        { name: "Profile", link: "/profile" },
      ];

      const userMenu = [
        { name: "Polls", link: "/" },
        { name: "Choice", link: "/choice"},
        { name: "Chat", link: "/chat"},
        { name: "FeedBack", link: "/feedback"},
        { name: "Profile", link: "/profile" },
      ];
    const famMenu = [
      {name: "Home", link: "/"},
      {name: "Goal", link: "/famgoal"},
      {name: "Add Member", link: "/addmember"},
      {name: "Election", link: "/famelection"},
      {name: "Task", link: "/famtask"},
      { name: "Profile", link: "/profile" },
    ]

      if (authContext.isAdmin) {
        return (
          <Default menu={adminMenu}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/users" element={<AdminUsersPage />} />
              <Route path="/verify/:name/:id" element={<AdminVerifyPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Default>
        );
      } 
      else if(authContext.Role == "Father" ||authContext.Role == "Son"||authContext.Role == "Daughter"||authContext.Role == "Grand Mother"||authContext.Role == "Grand Father" || authContext.Role == "Mother"){
        return(
          <Default menu = {famMenu}>
            <Routes>
              <Route path="/" element={<Famhome />} />
              <Route path="/famgoal" element={<Famgoal />} />
              <Route path="/famelection" element={<Famelection />} />
              <Route path="/addmember" element={<Famadd />} />
              <Route path="/famtask" element={<Famtask />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Default>
        )
      }
        else{
          
        return (
          <Default menu={userMenu}>
            <Routes>
              <Route path="/" element={<UserPollsPage />} />
              <Route path="/choice" element={<ChoicePage/>} />
              <Route path="/chat" element={<ChatPage/>} />
              <Route path="/feedback" element={<FeedbackPage/>} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Default>
        
        );
       }
      }
   
    
    

    
    else {
      // if the user is not authenticated
      return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/famsign" element={<Signupfam />} />
          <Route path="/famlogin" element={<LoginFam />} />
          <Route path="/view" element={<View />} />
        </Routes>
      );
    }

  };

  return getRoutes();
};
