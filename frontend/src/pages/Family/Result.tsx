import React, { useEffect, useState } from "react";
import axios from "../../axios";
import FamChart from "../../components/Polls/Famchart";
import FamPanel from "../../components/Polls/Fampanel";
import {ethers} from 'ethers';
import {abi} from '../../electionabi';
const Result = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ name: "", description: "", votes: {} });
  const [address, setAddress] = useState<string>(" ");

  useEffect(() => {
    axios.get("/polls/").then((res) => {
      setData(res.data);
      setLoading(false);
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
  }, []);
  async function resetElection() {
    try {
      // Perform the axios request
      axios.post("/polls/reset");
  
      // Ethereum interactions
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
  
      const instance = new ethers.Contract(address, abi, signer);
  
      // Execute the contract function
      const tx = await instance.resetElection();
      await tx.wait()

      window.location.reload();
      
    } catch (err) {
      console.error(err);
    }
  }
  

  if (loading) return <div></div>;

  return (
    <FamPanel name={data.name} description={data.description}>
      <>
        <FamChart votes={data.votes} />

        <button
          onClick={resetElection}
          className="end-election-button button-primary"
        >
          Reset Election
        </button>
      </>
    </FamPanel>
  );
};

export default Result;
