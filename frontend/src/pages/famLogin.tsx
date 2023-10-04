import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { Formik } from "formik";
import { RouteProps } from "react-router";
import LoginLayout from "../layouts/Login";
import * as Yup from "yup";
import axios from "../axios";
import { AuthContext } from "../contexts/Auth";

const schema = Yup.object().shape({
  Login: Yup.string().min(3).required(), 
  password: Yup.string().min(3).required("Required"),
});

const Login = (props: RouteProps): JSX.Element => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [error, setError] = useState<any>("");

  return (
    <div>
      <LoginLayout error={error}>
        <div className="form-container">
          <Formik
            initialValues={{
              Login: "",
              password: "",
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              axios
                .post("/family/famlogin", { ...values })
                .then((res) => {
                  authContext.authenticate(res.data.user, res.data.accessToken);
                })
                .catch((err) => {
                  let error = err.message;
                  if (err?.response?.data)
                    error = JSON.stringify(err.response.data);
                  setError(error);
                });
            }}
          >
            {({ errors, touched, getFieldProps, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="input-container">
                  <input
                    id="Login"
                    type="text"
                    placeholder="Login"
                    {...getFieldProps("Login")}
                  />
                  <div className="form-error-text">
                    {touched.Login && errors.Login? errors.Login : null}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    {...getFieldProps("password")}
                  />
                  <div className="form-error-text">
                    {touched.password && errors.password
                      ? errors.password
                      : null}
                  </div>
                </div>

                <button className="login-button button-primary" type="submit">
                  Login
                </button>
              </form>
            )}
          </Formik>

          <div className="form-info-text">Forgot Password?</div>

          <hr />

          <button
            onClick={() => navigate("/famsign")}
            className="button-secondary"
          >
            Create a New Account
          </button>
        </div>
      </LoginLayout>
    </div>
  );
};

export default Login;
