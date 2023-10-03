import React, { useContext, useState, useEffect } from "react";
import { RouteProps } from "react-router";
import { AuthContext } from "../../contexts/Auth";
import axios from "../../axios";
import Info from "../../layouts/information";
import { Formik } from "formik";
import * as yup from "yup";

const schema = yup.object().shape({
  Task: yup.string().required(),
  Date: yup.string().required(),
  Reward: yup.number().required(),
});

interface Task {
  TaskID: number;
  Task: string;
  Reward: number;
  Date: string;
  Login: string;
  status: string;
  DeclinedUsers: string;
  AcceptedUser: string;
  Completed: boolean;
}
interface Familysignup{
  Login: string;
  FirstName: string;
  LastName: string;
}

const Task = (props: RouteProps) => {
  const [error, setError] = useState<any>("");
  const [success, setSuccess] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState<Familysignup[]>([]);
  const authContext = useContext(AuthContext);
  const fixedlogin = authContext.Login.toString();
  const prefix = fixedlogin.split('_')[0];

  const fetchTasks = () => {
    axios
      .get(`/family/fetchtask?prefix=${prefix}`)
      .then((res) => {
        setTasks(res.data.tasks);
        setName(res.data.familyNames);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
      });
  };


  
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDecline = (taskId: number) => {

    axios
    .post(`/family/declinetask?Login=${fixedlogin}&TaskID=${taskId}`)// Send taskId and userLogin to the declineTask endpoint
      .then((res) => {
        // Handle success, for example, you can show a message to the user
        console.log("Task declined successfully");
        // Refresh the list of tasks or update state as needed
        fetchTasks();
      })
      .catch((err) => {
        // Handle error, for example, show an error message
        console.error("Error declining task:", err);
      });
  };
  const handleAccept = (taskId: number) => {

    axios
    .post(`/family/accepttask?FirstName=${authContext.FirstName}&TaskID=${taskId}`)// Send taskId and userLogin to the declineTask endpoint
      .then((res) => {
        // Handle success, for example, you can show a message to the user
        console.log("Task accepted successfully");
        // Refresh the list of tasks or update state as needed
        fetchTasks();
      })
      .catch((err) => {
        // Handle error, for example, show an error message
        console.error("Error accpeting task:", err);
      });
  };
  const handleDone = (taskId: number) => {

    axios
    .post(`/family/completed?TaskID=${taskId}`)
    .then((res) => {
      // Handle success, for example, you can show a message to the user
      console.log("Task marked as completed successfully");
      // Refresh the list of tasks or update state as needed
      fetchTasks();
    })
    .catch((err) => {
      // Handle error, for example, show an error message
      console.error("Error marking task as completed:", err);
    });
  };
  const handleDelete = (taskId: number) => {
    console.log("hey");
    axios
    .delete(`/family/deletetask?TaskID=${taskId}`)
    .then((res) => {
      // Handle success, for example, you can show a message to the user
      console.log("Task deleted successfully");
      // Refresh the list of tasks or update state as needed
      fetchTasks();
      window.location.reload();
    })
    .catch((err) => {
      // Handle error, for example, show an error message
      console.error("Error deleting task:", err);
    });
  };
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1}} >
        <Info error={error} success={success}>
          <div className="form-container">
            <Formik
              initialValues={{
                Task: "",
                Date: "",
                Reward: "",
                Login: fixedlogin,
              }}
              validationSchema={schema}
              onSubmit={({ Task, Date, Reward, Login }) => {
                axios
                  .post("/family/taskset", {
                    Task,
                    Reward,
                    Date,
                    Login,
                  })
                  .then((res) => {
                    setError("");
                    setSuccess("Your task added successfully!");
                    fetchTasks();
                  })
                  .catch((err) => {
                    let error: string = err.message;
                    if (err?.response?.data)
                      error = JSON.stringify(err.response.data);
                    setError(error.slice(0, 50));
                  });
              }}
            >
              {({ errors, touched, handleSubmit, getFieldProps }) => (
                <form onSubmit={handleSubmit}>
                  <p className="title-small" style={{ textAlign: "center" }}>
                    Your task
                  </p>
                  <div className="input-container">
                    <p className="text-small">Task: </p>
                    <input
                      id="Task"
                      type="text"
                      placeholder="Task"
                      {...getFieldProps("Task")}
                    />
                    <div className="form-error-text">
                      {touched.Task && errors.Task ? errors.Task : null}
                    </div>
                  </div>
                  <p className="text-small">Reward </p>
                  <div className="input-container">
                    <input
                      id="Reward"
                      type="text"
                      placeholder="Reward"
                      {...getFieldProps("Reward")}
                    />
                    <div className="form-error-text">
                      {touched.Reward && errors.Reward
                        ? errors.Reward
                        : null}
                    </div>
                  </div>
                  <p className="text-small">Due to </p>
                  <div className="input-container">
                    <input
                      id="Date"
                      type="date"
                      placeholder="Date"
                      {...getFieldProps("Date")}
                    />
                    <div className="form-error-text">
                      {touched.Date && errors.Date ? errors.Date : null}
                    </div>
                  </div>
                  <button className="button-primary" type="submit">
                    Create task
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </Info>
      </div>
      <div style={{ flex: 1, marginLeft: "200px" }}>
      <div className="task-list">
        {tasks.map((task: Task) => (
          // Check the status of the task and DeclinedUsers array
          task.status === 'pending' &&
          (!task.DeclinedUsers || !task.DeclinedUsers.includes(fixedlogin)) ? (
            <div className="task-info-box" key={task.TaskID}>
              <p>From: {name.filter((names: Familysignup) => names.Login === task.Login)
                .map((match) => `${match.FirstName} ${match.LastName}`)}</p>
              <p>Task: {task.Task}</p>
              <p>Reward: {task.Reward} ₸</p>
              <p>Due to: {task.Date}</p>
              <div className="button-container">
                {task.Login === authContext.Login ? (
                <p className="title-small">It is your task</p>
            ) : (
               <>
                 <button className="accept-button" onClick={() => handleAccept(task.TaskID)}>Accept</button>
                 <button className="decline-button" onClick={() => handleDecline(task.TaskID)}>Decline</button>
              </>
            )}
          </div>

            </div>
          ) : (task.Completed && task.Login === authContext.Login) || (task.Completed && authContext.FirstName === task.AcceptedUser)? (
            <div className="task-info-box" key={task.TaskID}> 
            <div className="completed-button">
            <span>Completed by {task.AcceptedUser}</span>
            </div>
            {task.Login === authContext.Login && (
              <button className="delete-button" onClick={() => handleDelete(task.TaskID)}>Delete task</button>
            )}
            </div>
          ) : task.status === 'accepted' ? (
            <div className="task-info-box" key={task.TaskID}>
              <p>The task was taken by {task.AcceptedUser}</p>
              {task.AcceptedUser === authContext.FirstName && (
                  <button className="done-button" onClick={() => handleDone(task.TaskID)}>Done</button>
                )}
            </div>
          ) : null
        ))}
  </div>
</div>

 
</div>

  );
};

export default Task;
