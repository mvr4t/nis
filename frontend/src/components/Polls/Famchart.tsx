import React from "react";
import axios from "../../axios";
import {ethers} from "ethers";
import {abi} from "../../electionabi";

interface ChartProps {
  votes: any;
  enableVote?: boolean;
  userId?: number;
  userName?: string;
}

const Chart = (props: ChartProps) => {
  const votes = props.votes;
  const address = "0x3e8c0df0909DEB486a173695869CAd077A10fe0d";

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
      names.push(
        <div key={name} className="name-wrapper text-normal">
          {name}
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