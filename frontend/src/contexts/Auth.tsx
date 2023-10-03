import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "../axios";

type ContextProps = {
  children: JSX.Element;
};

type User = {
  id: number;
  Fam_ID: number;
  FirstName: string;
  LastName: string;
  Login: string;
  citizenshipNumber: string;
  email: string;
  password: string;
  Role: string;
  admin: boolean;
};

export const AuthContext = createContext({
  id: 0,
  Fam_ID: 0,
  FirstName: "",
  LastName: "",
  Login: "",
  citizenshipNumber: "",
  email: "",
  password: "",
  Role: "",
  isAdmin: false,
  authenticated: false,
  accessToken: "",
  loading: true,
  authenticate: (user: User, token: string) => {},
  logout: () => {},
});

export default (props: ContextProps): JSX.Element => {
  const navigate = useNavigate();

  const [authentication, setAuthentication] = useState({
    id: 0,
    Fam_ID: 0,
    FirstName: "",
    LastName: "",
    Login: "",
    citizenshipNumber: "",
    email: "",
    password: "",
    Role: "",
    isAdmin: false,
    authenticated: false,
    accessToken: "",
    loading: true,
  });

  const checkAuthentication = () => {
    axios
      .post("/auth/check")
      .then((res) => authenticate(res.data.user, res.data.accessToken, false))
      .catch((error) => {
        console.log(error);
        setAuthentication({ ...authentication, loading: false });
      });
  };

  useEffect(() => {
    checkAuthentication();

    const interval = setInterval(checkAuthentication, 5 * 1000);

    return () => clearInterval(interval);
  }, []);

  const authenticate = (
    user: User,
    token: string,
    redirect: boolean = true
  ) => {
    setAuthentication({
      id: user.id,
      Fam_ID: user.Fam_ID,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Login: user.Login,
      citizenshipNumber: user.citizenshipNumber,
      email: user.email,
      password: user.password,
      Role: user.Role,
      isAdmin: user.admin,
      authenticated: true,
      accessToken: token,
      loading: false,
    });

    if (redirect) navigate("/");
  };

  const logout = async () => {
    await axios.post("/auth/logout");

    setAuthentication({
      id: 0,
      Fam_ID: 0,
      FirstName: "",
      LastName: "",
      Login: "",
      citizenshipNumber: "",
      email: "",
      password: "",
      Role: "",
      isAdmin: false,
      authenticated: false,
      accessToken: "",
      loading: false,
    });

    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        id: authentication.id,
        Fam_ID: authentication.Fam_ID,
        FirstName: authentication.FirstName,
        LastName: authentication.LastName,
        Login: authentication.Login,
        citizenshipNumber: authentication.citizenshipNumber,
        email: authentication.email,
        password: authentication.password,
        Role: authentication.Role,
        isAdmin: authentication.isAdmin,
        authenticated: authentication.authenticated,
        accessToken: authentication.accessToken,
        loading: authentication.loading,
        authenticate,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
