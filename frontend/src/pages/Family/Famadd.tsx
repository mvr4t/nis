import React, { useContext, useState,useEffect } from "react";
import { useNavigate } from "react-router";
import Select from 'react-select';
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "../../axios";
import { AxiosRequestConfig } from "axios";
import { AuthContext } from "../../contexts/Auth";
import Family from "../../layouts/Family";
type roleOption = { label: string; value: string };

const schema = Yup.object().shape({
  FirstName: Yup.string().min(3).required(),
  LastName: Yup.string().min(3).required(),
  Role: Yup.string().required(),
  email: Yup.string().email("Invalid email").required("Required"),
  citizenshipNumber: Yup.string().min(11, "must be exactly 11 digits").max(11, "must be exactly 11 digits").matches(/^[0-9]+$/,"Must be only digits").required(), 
});

const role = [
    {label: "Father", value: "1"},
    {label: "Mother", value: "2"},
    {label: "Son", value: "3"},
    {label: "Daughter", value: "4"},
    {label: "Grand Father", value: "5"},
    {label: "Grand Mother", value: "6"},

]

const Famadd = (): JSX.Element => {
  const [error, setError] = useState<any>("");
  const [success, setSuccess] = useState<string>("");
  const [isfirst, setIsfirst] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<roleOption | null>(null);
  const authContext = useContext(AuthContext);
  
  const handleRoleChange = (selectedOption: roleOption | null) => {
    setSelectedRole(selectedOption);
  };
  useEffect(() => {
    axios
      .get(`/family/isfirst?Login=${authContext.Login}`)
      .then((res) => {
        if(res.data.isfirst){
          setIsfirst(true);
        }
      })
      .catch((error) => console.log({ error }));
  }, []);
  
  return (
    <div>
    <Family error={error} success={success}>

        {isfirst ? (
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
          }}
          validationSchema={schema}
          onSubmit={({ FirstName, LastName,Login,Role, email, citizenshipNumber, password }) => {
              
            axios
              .post("/family/membersign", {
                FirstName,
                LastName,
                Login: `${authContext.Login}_${FirstName.toLowerCase()}`,
                Role,
                email,
                citizenshipNumber,
                password,
              })
              .then((res) => {
                setSuccess("Success!")
                
              })
              .catch((err) => {
                let error: string = err.message;
                if (err?.response?.data)
                  error = JSON.stringify(err.response.data);
                setError(error.slice(0, 50));
              });
              
          }}
        >
          {({ errors, touched, getFieldProps, handleSubmit, setFieldValue }) => (
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
                <Select
                  id="Role"
                  placeholder="Select member's role..."
                  options={role}
                  value={selectedRole}
                  onChange={(option) => {
                    handleRoleChange(option);
                    setFieldValue("Role", option ? option.label : "");
                  }}
                />
                <div className="form-error-text">
                  {touched.Role && errors.Role ? errors.Role : null}
                </div>
              </div>

              <button className="button-primary" type="submit">
                Create
              </button>
            </form>
          )}
        </Formik>
      </div>
      ) : (
        <div className="form-container" style={{ border: "1px solid transparent", outline: "2px solid #fe2712", outlineWidth: "1px"}}>
          <h1 className="title-small" style={{color: "#fe2712"}}>The first user should add member</h1>
          </div>
      )}
      </Family>
    </div>
  );
};

export default Famadd;
