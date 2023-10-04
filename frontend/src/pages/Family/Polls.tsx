import React, { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import Chart from "../../components/Polls/Famchart";
import FamPanel from "../../components/Polls/Fampanel";
import FamWaiting from "../../components/Famwaiting";
import FamRunning from "../../components/Polls/Famrunning";
import FamFinished from "../../components/Polls/Famfinished";
import {ethers} from 'ethers';
import {abi} from '../../electionabi';
import { AuthContext } from "../../contexts/Auth";
const Polls = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ name: "", description: "", votes: {} });
  const [voteState, setVoteStatus] = useState<
  "finished" | "running" | "not-started" | "checking"
>("checking");

const [votable, setVotable] = useState("");
  
  useEffect(() => {
    axios.get("/polls/").then((res) => {
      console.log(res.data)
      setData(res.data);
      setLoading(false);
    });
    
  }, []);
  const address = "0x3e8c0df0909DEB486a173695869CAd077A10fe0d";
  const authContext = useContext(AuthContext);
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

useEffect(() => {
  console.log("called here ?");

  axios
    .get("/polls/status")
    .then((res) => {
      setVoteStatus(res.data.status);
      setLoading(false);
    })
    .catch((error) => console.log({ error }));
}, []);

useEffect(() => {
  if (voteState !== "checking") {
    axios.get("/polls/").then((res) => {
      setData(res.data);
      setLoading(false);
    });

    axios
      .post("/polls/check-voteability", {
        id: authContext.Fam_ID.toString(),
      })
      .then((res) => {
        setVotable(res.data);
      })
      .catch((err) => console.log(err));
  }
});

if (loading || voteState === "checking") return <div></div>;

if (voteState === "not-started") return <FamWaiting />;
  return (
    <>
    {authContext.Role === "Father" ? (
      <FamPanel name={data.name} description={data.description}>
        <>
        {voteState === "running" ? <FamRunning /> : <FamFinished />}
          <Chart  
          enableVote={votable === "not-voted"}
          userId={authContext.Fam_ID}
          userName={authContext.FirstName}
          votes={data.votes} 
          />

          <button
            onClick={endElection}
            className="end-election-button button-primary"
          >
            End Election
          </button>
        </>
      </FamPanel>
    ) : (
      <FamPanel name={data.name} description={data.description}>
      <>
        {voteState === "running" ? <FamRunning /> : <FamFinished />}

        <Chart
          enableVote={votable === "not-voted"}
          userId={authContext.Fam_ID}
          userName={authContext.FirstName}
          votes={data.votes}
          
        />
      </>
    </FamPanel>
    )}
  </>
  );
};

export default Polls;
