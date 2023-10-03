import React, { useRef, useState, useEffect } from "react";
import { Formik } from "formik";
import axios from "../../axios";
import * as yup from "yup";
import {ethers} from "ethers";
import {abi} from "../../electionabi.js";
const schema = yup.object({
  pollname: yup.string().min(3).required(),
  description: yup.string().min(10).required(),
});

interface Candidate {
  name: string;
  info: string;
}

const Start = () => {
  const [candidates, setCandidates] = useState<Array<Candidate>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [descriptions, setDescription] = useState<string>("");
  const [pollnames, setPollname] = useState<string>("");
  const candidateImageInputRef = useRef<HTMLInputElement | null>(null);


  const candidateField = useRef<HTMLInputElement>(null);
  const candidateInfoField = useRef<HTMLInputElement>(null);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(false);
  const [ethereumAccount, setEthereumAccount] = useState<string | null>(null);
 
  useEffect(() => {
    if((window as any).ethereum){
      //check if Metamask wallet is installed
      setIsMetamaskInstalled(true);
    }
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

  const address = "0x3e8c0df0909DEB486a173695869CAd077A10fe0d";
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
          const addCandidatetx = await instance.addCandidate(candidate.name, candidate.info);
          await addCandidatetx.wait();
        }

        window.location.reload();
      }
      catch(err){
        console.error(err);
      }
        
      }
      
      
      


      

    

  const handleAddCandidate = () => {
    const formData = new FormData();
    formData.append("candidateName", name);
    formData.append("info", info);
  
    // Add the candidate image to the formData (if selected)
    if (selectedImage) {
      formData.append("candidateImage", selectedImage);
    }
  
    axios
      .post("/polls/info", formData)
      .then((_) => {
        setSelectedImage(null);
        if (candidateImageInputRef.current) {
          candidateImageInputRef.current.value = "";
        }
      })
      .catch((err) => {
        let error = err.message;
        if (err?.response?.data) error = err.response.data;
        setError(error.slice(0, 50));
        setLoading(false);
      });
  };
  
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
        onSubmit={({ pollname, description}) => {
          setLoading(true);
          
          let candidatesError = "";

          if (candidates.length < 2) candidatesError = "Not Enough Candidates";

          for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];

            if (candidate.name.length < 3) {
              candidatesError = "invalid name " + candidate.name;
              break;
            }

            if (candidate.info.length < 10) {
              candidatesError = "invalid info for " + candidate.name;
              break;
            }
          }
          setPollname(pollname);
          setDescription(description);
          setError(candidatesError);
          if (candidatesError === "") {
            setElectionDetails();
          }

         
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

            {candidates.length !== 0 ? (
              <div className="candidates-container">
                {candidates.map(({ name, info }, index) => (
                  <div key={index} className="candidate-wrapper">
                    <span>{name}</span>
                    <span
                      onClick={() => {
                        const newList = [...candidates];
                        const i = newList.indexOf({ name, info });
                        newList.splice(i, 1);

                        setCandidates(newList);
                      }}
                      className="remove"
                    >
                      <i className="bi bi-dash-circle"></i>
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="input-container">
              <div className="add-candidate-wrapper">
                <input
                  id="candidateName"
                  type="text"
                  placeholder="Add Candidate"
                  ref={candidateField}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
               

                <button
                  className=""
                  type="button"
                  onClick={() => {
                    const newCandidate = { name, info };
                    setCandidates([...candidates, newCandidate]);
                    if (candidateField.current)
                      candidateField.current.value = "";
                    if (candidateInfoField.current)
                      candidateInfoField.current.value = "";
                    

                    handleAddCandidate();
                  }}
                 

                >
                  Add
                </button>
              </div>
            </div>

            <div className="input-container">
              <div className="add-candidate-wrapper">
                <input
                  id="info"
                  type="text"
                  placeholder="Candidate Info"
                  ref={candidateInfoField}
               
                  onChange={(e) => {
                    setInfo(e.target.value);
                  }}
                />
               
              </div>
            </div>

            <div className="input-container" style={{ marginTop: "20px" }}>
              <h3 className="text-normal">Choose a photo of the candidate</h3>
              <div className="add-candidate-wrapper">
                <input
                  id="candidateImage"
                  placeholder="Choose a photo of the candidate"
                  type="file"
                  accept="image/*"
                  ref={candidateImageInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedImage(file);
                  }}
                />
               
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
