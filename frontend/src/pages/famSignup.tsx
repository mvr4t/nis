import React, { useState } from "react";
import { useNavigate } from "react-router";
import Select from 'react-select';
import { Formik } from "formik";
import LoginLayout from "../../../../Nis/frontend/src/layouts/Login";
import * as Yup from "yup";
import axios from "../axios";
import { AxiosRequestConfig } from "axios";

type roleOption = { label: string; value: string };

const schema = Yup.object().shape({
  FirstName: Yup.string().min(3).required(),
  LastName: Yup.string().min(3).required(),
  Login: Yup.string().min(3).required(),
  Role: Yup.string().required(),
  email: Yup.string().email("Invalid email").required("Required"),
  citizenshipNumber: Yup.string().min(11, "must be exactly 11 digits").max(11, "must be exactly 11 digits").matches(/^[0-9]+$/,"Must be only digits").required(), 
  password: Yup.string().min(3).required("Required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "must be same as password")
    .required(),
});

const role = [
    {label: "Father", value: "1"},
    {label: "Mother", value: "2"},
    {label: "Son", value: "3"},
    {label: "Daughter", value: "4"},
    {label: "Grand Father", value: "5"},
    {label: "Grand Mother", value: "6"},

]


const Signup = (): JSX.Element => {
  const navigate = useNavigate();

  const [error, setError] = useState<any>("");
  const [success, setSuccess] = useState<string>("");
  const [selectedRole , setSelectedRole] = useState<roleOption | null>(null);

  const handleRoleChange = (selectedOption: roleOption | null) =>{
    setSelectedRole(selectedOption);
 
  };
  return (
    <div>
      <LoginLayout error={error} success={success}>
        <div className="form-container">
          <Formik
            initialValues={{
              FirstName: "",
              LastName: "",
              Login: "",
              Role: "",
              email: "",
              citizenshipNumber: "",
              password: "",
              confirm: "",
            }}
            validationSchema={schema}
            onSubmit={({ FirstName, LastName,Login,Role, email, citizenshipNumber, password }) => {
              
              axios
                .post("/family/famsign", {
                  FirstName,
                  LastName,
                  Login,
                  Role,
                  email,
                  citizenshipNumber,
                  password,
                })
                .then((res) => {
                  setError("");
                  setSuccess("Signup Successful!");
                  
                })
                .catch((err) => {
                  let error: string = err.message;
                  if (err?.response?.data)
                    error = JSON.stringify(err.response.data);
                  setError(error.slice(0, 50));
                });
                
            }}
          >
            {({ errors, touched, getFieldProps, handleSubmit,setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <div className="input-container">
                  <input
                    id="FirstName"
                    type="text"
                    placeholder="First Name"
                    {...getFieldProps("FirstName")}
                  />
                  <div className="form-error-text">
                    {touched.FirstName && errors.FirstName ? errors.FirstName : null}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    id="LastName"
                    type="text"
                    placeholder="Last Name"
                    {...getFieldProps("LastName")}
                  />
                  <div className="form-error-text">
                    {touched.LastName && errors.LastName ? errors.LastName : null}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    id="Login"
                    type="text"
                    placeholder="Login"
                    {...getFieldProps("Login")}
                  />
                  <div className="form-error-text">
                    {touched.Login && errors.Login ? errors.Login : null}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    id="citizenshipNumber"
                    type="text"
                    placeholder="Citizenship Number"
                    {...getFieldProps("citizenshipNumber")}
                  />
                  <div className="form-error-text">
                    {touched.citizenshipNumber && errors.citizenshipNumber
                      ? errors.citizenshipNumber
                      : null}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    {...getFieldProps("email")}
                  />
                  <div className="form-error-text">
                    {touched.email && errors.email ? errors.email : null}
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

                <div className="input-container">
                  <input
                    id="confirm"
                    type="password"
                    placeholder="Confirm Password"
                    {...getFieldProps("confirm")}
                  />
                  <div className="form-error-text">
                    {touched.confirm && errors.confirm ? errors.confirm : null}
                  </div>
                </div>
                <div className="input-container">
                    <Select 
                    id="Role"
                    placeholder="Select your role..."
                    options={role}
                    value={selectedRole}
                    onChange={(option) =>{
                        handleRoleChange(option);
                        setFieldValue("Role", option ? option.label : "");
                    }}
                    />
                    <div className="form-error-text">
                        {touched.Role && errors.Role ? errors.Role : null}
                    </div>
                </div>
                
                <button className="button-primary" type="submit">
                  Create a New Account
                </button>
              </form>
            )}
          </Formik>

          <hr />
          <div className="form-info-text">Already have an account?</div>

          <button
            onClick={() => navigate("/famlogin")}
            className="button-secondary"
            type="button"
          >
            Login
          </button>
        </div>
      </LoginLayout>
    </div>
  );
};

export default Signup;
