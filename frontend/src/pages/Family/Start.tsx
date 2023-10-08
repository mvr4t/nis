import React, { useRef, useState, useEffect, useContext } from "react";
import { Formik } from "formik";
import axios from "../../axios";
import * as yup from "yup";
import {ethers} from "ethers";
import {abi} from "../../electionabi.js";
import { AuthContext } from "../../contexts/Auth";
const schema = yup.object({
  pollname: yup.string().min(3).required(),
  description: yup.string().min(10).required(),
});

interface Candidate {
  FirstName: string;
  LastName: string;
}
interface Name {
  name: string;
}

const Start = () => {
  const [candidates, setCandidates] = useState<Array<Candidate>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<Name[]>([]);
  const [error, setError] = useState<string>("");
  const [descriptions, setDescription] = useState<string>("");
  const [pollnames, setPollname] = useState<string>("");
  const authContext = useContext(AuthContext);
  const fixedlogin = authContext.Login;
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(false);
  const [ethereumAccount, setEthereumAccount] = useState<string | null>(null);
  const prefix = fixedlogin.split('_')[0];
  const [address, setAddress] = useState<string>(" ");

  useEffect(() => {
    if((window as any).ethereum){
      //check if Metamask wallet is installed
      setIsMetamaskInstalled(true);
    }
    axios
    .get(`/family/getfam?Login=${prefix}`)
    .then((res) => {
      setCandidates(res.data.users);
      setName(res.data.name);
      console.log(res.data.users);
      console.log(res.data.name);
    })
    .catch((err) => {
      console.log(err);
    });
    axios
    .get(`/polls/status`)
    .then((res) => {
      setAddress(res.data.contractAddress)
      console.log(res.data.contractAddress)
    })
    .catch((err) => {
      console.error(err);
    });
  },[]);

  async function connectMetamaskWallet(): Promise<void> {
    //to get around type checking
    (window as any).ethereum
      .request({
          method: "eth_requestAccounts",
      })
      .then((accounts : string[]) => {
        setEthereumAccount(accounts[0]);
      })
      .catch((error: any) => {
          alert(`Something went wrong: ${error}`);
      });
  }
  if (ethereumAccount === null) {
    return (
      <div>
        {
          isMetamaskInstalled ? (
            <div>
              <button onClick={connectMetamaskWallet}>Connect Your Metamask Wallet</button>
            </div>
          ) : (
            <p>Install Your Metamask wallet</p>
          )
        }
 
      </div>
    );
  }

      async function setElectionDetails(){
        try{
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts",[]);
        const signer = provider.getSigner();
        
        const instance = new ethers.Contract(address, abi, signer)
        const setElectionDetailstx = await instance.setElectionDetails(pollnames, descriptions);
        await setElectionDetailstx.wait();
        for (let i = 0; i <  candidates.length; i++) {
          const candidate = candidates[i];
          const names = name[i];
          const fullName = `${candidate.FirstName} ${candidate.LastName}`;
          const addCandidatetx = await instance.addCandidate(fullName, names.name);
          await addCandidatetx.wait();
        }

        window.location.reload();
      }
      catch(err){
        console.error(err);
      }
        
      }
  
  return (
    <div className="form-container">
      <div>
     <header>
       <p>
         ETH wallet connected as: {ethereumAccount}
       </p>
     </header>
   </div> 
      {error !== "" ? <div className="error-message">{error}</div> : null}

      <Formik
        initialValues={{
          pollname: "",
          description: "",

        }}
        validationSchema={schema}
        onSubmit={({pollname, description }) => {
          setLoading(true);
          setPollname(pollname);
          setDescription(description);
          console.log("POLL POLL POLL POLL: ",pollnames)
          console.log("DESC DESC DESC DESC: ",descriptions)
          setElectionDetails();

         
        }}
      >
        {({ errors, touched, getFieldProps, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                id="name"
                type="text"
                placeholder="Poll Name"
                {...getFieldProps("pollname")}
              
              />

              <div className="form-error-text">
                {touched.pollname && errors.pollname ? errors.pollname : null}
              </div>
            </div>

            <div className="input-container">
              <input
                id="description"
                type="text"
                placeholder="Poll Description"
                {...getFieldProps("description")}
              
              />

              <div className="form-error-text">
                {touched.description && errors.description
                  ? errors.description
                  : null}
              </div>
            </div>
           

            <button className="login-button button-primary" type="submit">
              Start Election
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Start;
