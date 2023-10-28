import React, {useContext, useEffect, useState}from "react";
import axios from "../../axios";
import {ethers} from "ethers";
import {abi} from "../../electionabi";
import { AuthContext } from "../../contexts/Auth";
interface ChartProps {
  votes: any;
  enableVote?: boolean;
  userId?: number;
  userName?: string;
}
type Famgoal = {
  name: string;
  reason: string;
  amount: string;
  thing: string;
}
const Chart = (props: ChartProps) => {
  const votes = props.votes;
  const [address, setAddress] = useState<string>(" ");
  const [candidateBlocks, setCandidateBlocks] = useState<Famgoal[]>([]);  
  const authContext = useContext(AuthContext);
  const fixedlogin = authContext.Login;
  const prefix = fixedlogin.split('_')[0];

  useEffect(() => {
    axios
    .get(`/polls/candidateData?Login=${prefix}`)
    .then((res) => {
      setCandidateBlocks(res.data.famcandidateBlocks)
      console.log(res.data.famcandidateBlocks)
    })
    .catch((err) => {
      console.error(err);
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
  const getButtons = () => {
    const names = [];

    async function vote(candidate: string){
        
          const provider = new ethers.providers.Web3Provider((window as any).ethereum);
          await provider.send("eth_requestAccounts",[]);
          const signer = provider.getSigner();
          const instance = new ethers.Contract(address, abi, signer)
          const voters: Array<any> = await instance.getVoters();
          const candidates: Array<any> = await instance.getCandidates();

          if (voters.includes(props.userId))
            return ("already voted");

          if (!candidates.includes(candidate))
            return ("no such candidate");

          await instance.vote(props.userId?.toString(), props.userName, candidate);

          console.log("heeey")
          
    };

    for (const name in votes) {
      names.push(
        <button
          onClick={() => vote(name)}
          key={name}
          className="button-wrapper text-normal"
        >
          vote
        </button>
      );
    }

    return names;
  };


  const getNames = () => {

  
    const names = [];
  
    for (const name in votes) {
      const candidate = candidateBlocks.find((candidate) => candidate.name === name);

  
        names.push(
          <div key={name} className="name-wrapper text-normal">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>{name}</div>
            </div>
           <div style={{
                marginTop: "20px",
              }}>
                <p style={{ marginBottom: "10px" }}>Thing: {candidate?.thing}</p>
                <p style={{ marginBottom: "10px" }}>Reason: {candidate?.reason}</p>
                <p>Cost: {candidate?.amount}₸</p>
          </div>
          </div>
        );
      }
    
  
    return names;
  };
  
  

  const getTotal = () => {
    let total = 0;

    for (const name in votes) {
      total += parseInt(votes[name]);
    }

    return total;
  };

  const getBars = () => {
    const bars = [];
    const total = getTotal();

    for (const name in votes) {
      const count = votes[name];
      bars.push(
        <div key={name} className="bar-wrapper">
          <div
            style={{
              height: count != 0 ? `${(count * 100) / total}%` : "auto",
              border: "2px solid #4daaa7",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              color: "white",
              backgroundColor: "rgb(77, 170, 167)",
              paddingBottom: 10,
              paddingTop: 10,
            }}
          >
            {votes[name]}
          </div>
        </div>
      );
    }

    return bars;
  };

  return (
    <div>
      <div className="bars-container">{getBars()}</div>
      <div className="names-wrapper">{getNames()}</div>

      {props.enableVote ? (
        <div className="buttons-wrapper">{getButtons()}</div>
      ) : null}
    </div>
  );
};

export default Chart;