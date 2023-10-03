import React, { useEffect, useState } from "react";
import axioss from "../../axios";
import { AxiosRequestConfig } from "axios";
import axios from "axios"
type User = {
  id: number;
  FirstName: string;
  LastName: string;
  citizenshipNumber: string;
  email: string;
}; 

const Users = () => {
  const [users, setUser] = useState<User[]>([]);

  useEffect(() => {
    axioss
      .get("/users/all")
      .then((res) => setUser(res.data.users))
      .catch((error) => console.log({ error }));
  }, []);

  
  
    const createUser = async () => {
      try {
        const data = {
          username: users.map((user) => (user.FirstName)).toString(),
          secret:  users.map((user) => (user.email)).toString(),
          email:  users.map((user) => (user.email)).toString(),
          first_name:  users.map((user) => (user.FirstName)).toString(),
          last_name:  users.map((user) => (user.LastName)).toString(),
          avatar: null,
        };

        const config: AxiosRequestConfig = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://api.chatengine.io/users/',
          headers: {
            'PRIVATE-KEY': '275fd6d0-14fd-4e7a-b044-37cdf5e2518d', // Replace with your Chat Engine private key
          },
          data: data,
        }; 

        const response = await axios(config);
        console.log('User created:', response.data);
      } catch (error) {
        console.log('Error creating user:', error);
      }
    };

    
  
  
  const verifyUser = (id: number | string) => {
    axioss
      .post("/users/verify", { userId: id })
      .then((res) => {
        console.log(res);
        removeUserFromList(id);
      })
      .catch((error) => console.log({ error }));
  };

  const deleteUser = (id: number | string) => {
    axioss
      .delete(`/users/delete/${id}`)
      .then((res) => {
        console.log(res);
        removeUserFromList(id);
      })
      .catch((error) => console.log({ error }));
  };

  const removeUserFromList = (id: number | string) => {
    const index = users.findIndex((user) => user.id == id);
    const newList = [...users];
    newList.splice(index, 1);
    setUser(newList);
  };

  if (users.length === 0) return <div></div>;

  return (
    <div className="users-wrapper">
      {users.map((user, index) => (
        <div key={index} className="user-wrapper">
          {user.FirstName} {user.LastName}, {user.citizenshipNumber}

          <div>
          <button
                onClick={() => {
                      verifyUser(user.id);
                      createUser();
   
                }}
              className="button-primary"
          >
           verify
          </button>

            <button
              onClick={() => deleteUser(user.id)}
              className="button-black"
            >
              delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Users;
