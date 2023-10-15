import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { info } from "console";
import {ethers} from "ethers";
import {abi} from "../../electionabi";
interface ChartProps {
  votes: any;
  enableVote?: boolean;
  userId?: number;
  userName?: string;

}
type Information = {
  name: string;
  description: string;
  image: string;

}

const Chart = (props: ChartProps) => {
  const votes = props.votes; 
  const [candidateBlocks, setCandidateBlocks] = useState<Information[]>([]);  
  const [address, setAddress] = useState<string>(" ");
  useEffect(() => {
    axios
    .get(`/polls/candidateData`)
    .then((res) => {
      setCandidateBlocks(res.data.candidateBlocks)
      console.log(res.data.candidateBlocks)
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
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const getNames = () => {
   
    const toggleCandidate = (name: string) => {
      if (expandedCandidate === name) {
        setExpandedCandidate(null);
        setClickedButton(null); // Reset clicked state when collapsing
      } else {
        setExpandedCandidate(name);
        setClickedButton(name); // Set clicked state when expanding
      }
    };
  
    const names = [];
  
    for (const name in votes) {
      const candidate = candidateBlocks.find((candidate) => candidate.name === name);
  
      if (candidate) {
        const isExpanded = expandedCandidate === name;
  
        names.push(
          <div key={name} className="name-wrapper text-normal">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>{name}</div>
              <button
                className={clickedButton === name ? "clicked-button" : "default-button"}
                style={{ marginLeft: "10px" }}
                onClick={() => toggleCandidate(name)}
              >
                {isExpanded ? "▲" : "▼"}
              </button>
            </div>
            {isExpanded && (
             
               <div className="flip-card">
               <div className="flip-card-inner">
                   <div className="flip-card-front">
                       <p className="title" style={{marginTop: "20px"}}>Candidate Description</p>
                       <p style={{marginBottom: "180px"}}>{candidate.description}</p>
                   </div>
                   <div className="flip-card-back">
                       <p className="title">Photo</p>
                       <img
                          src={`/uploads/${candidate.image}`}
                          alt={candidate.name}
                         style={{ maxWidth: "150px", maxHeight: "300px", marginLeft: "20px", marginBottom: "30px"}}
                        />
                   </div>
               </div>
           </div>
            )}
          </div>
        );
      }
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
