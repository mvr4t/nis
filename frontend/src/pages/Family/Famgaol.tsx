import React, { useContext, useState, useEffect } from "react";
import { RouteProps } from "react-router";
import { AuthContext } from "../../contexts/Auth";
import axios from "../../axios";
import Info from "../../layouts/information";
import { Formik } from "formik";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required(),
  reason: yup.string().required(),
  amount: yup.string().matches(/^[0-9]+$/, "Must be only digits").required(),
});

const Goal = (props: RouteProps) => {
  const authContext = useContext(AuthContext);
  const login = authContext.Login;
  const [error, setError] = useState<any>("");
  const [success, setSuccess] = useState<string>("");
  const [hasSubmittedGoal, setHasSubmittedGoal] = useState(false);

  useEffect(() => {
    // Check if the user has already submitted a goal
    axios
      .get(`/family/checkgoal?Login=${login}`)
      .then((res) => {
        if (res.data.goalExists) {
          setHasSubmittedGoal(true);
        }
      })
      .catch((err) => {
        // Handle the error if needed
        console.error('Error checking goal', err);
      });
  }, [login]);

  return (
    <div>
      <Info error={error} success={success}>
        <div className="form-container">
          {hasSubmittedGoal ? (
            <h1 className="text-normal">You have already submitted a goal.</h1>
          ) : (
            
            <Formik
              initialValues={{
                name: "",
                reason: "",
                amount: "",
                Login: login,
              }}
              validationSchema={schema}
              onSubmit={({ name, reason, amount, Login }) => {
                axios
                  .post("/family/handlegoal", {
                    name,
                    reason,
                    amount,
                    Login: login,
                  })
                  .then((res) => {
                    setError("");
                    setSuccess("Success");
                    setHasSubmittedGoal(true);
                  })
                  .catch((err) => {
                    let error = err.message;
                    if (err?.response?.data)
                      error = JSON.stringify(err.response.data);
                    setError(error.slice(0, 50));
                  });
              }}
            >
              {({ errors, touched, handleSubmit, getFieldProps }) => (
                <form onSubmit={handleSubmit}>
                  <h1 className="title-large">For election</h1>
                  <div className="input-container">
                    <p className="text-small">Your Goal: </p>
                    <input
                      id="name"
                      type="text"
                      placeholder="e.g. Laptop"
                      {...getFieldProps("name")}
                    />
                    <div className="form-error-text">
                      {touched.name && errors.name ? errors.name : null}
                    </div>
                  </div>

                  <div className="input-container">
                    <p className="text-small">Your Reason: </p>
                    <input
                      id="reason"
                      type="text"
                      placeholder="e.g. For my study"
                      {...getFieldProps("reason")}
                    />
                    <div className="form-error-text">
                      {touched.reason && errors.reason ? errors.reason : null}
                    </div>
                  </div>

                  <div className="input-container">
                    <p className="text-small">Amount: </p>
                    <input
                      id="amount"
                      type="text"
                      placeholder="e.g. 400000"
                      {...getFieldProps("amount")}
                    />
                    <div className="form-error-text">
                      {touched.amount && errors.amount ? errors.amount : null}
                    </div>
                  </div>

                  <button className="button-primary" type="submit">
                    Submit
                  </button>
                </form>
              )}
            </Formik>
          )}
        </div>
      </Info>
    </div>
  );
};

export default Goal;
