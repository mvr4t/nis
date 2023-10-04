import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Chart from "../../components/Polls/Chart";
import Panel from "../../components/Polls/Panel";
import {ethers} from 'ethers';
import {abi} from '../../electionabi';
const Polls = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ name: "", description: "", votes: {} });
  const [candidatesInfo, setCandidatesInfo] = useState({});
  useEffect(() => {
    axios.get("/polls/").then((res) => {
      console.log(res.data)
      setData(res.data);
      setLoading(false);
    });
    
  }, []);
  const address = "0x3e8c0df0909DEB486a173695869CAd077A10fe0d";
  async function endElection() {
    try{
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();
    
    const instance = new ethers.Contract(address, abi, signer)
    const tx =await instance.endElection();
    await tx.wait();
    const votes = await instance.getVotes();
    
    setData(votes);
    window.location.reload();
    }
    catch(err){
      console.error(err);
    }
    
  };

  if (loading) return <div></div>;

  return (
    <Panel name={data.name} description={data.description}>
      <>
        <Chart votes={data.votes} />

        <button
          onClick={endElection}
          className="end-election-button button-primary"
        >
          End Election
        </button>
      </>
    </Panel>
  );
};

export default Polls;
