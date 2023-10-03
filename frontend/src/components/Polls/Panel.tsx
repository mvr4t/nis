import React, { useContext, useEffect, useState } from "react";
import Chart from "./Chart";


interface PanelProps {
  name: string;
  description: string;
  children: JSX.Element;
}

const Panel = (props: PanelProps) => {
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


  return (
    <div className="polls-container">
     <div>
     <header>
       <p>
         ETH wallet connected as: {ethereumAccount}
       </p>
     </header>
   </div>
      <span className="title-small">{props.name}</span>
      <span className="text-normal">{props.description}</span>
      <div className="votes-wrapper">{props.children}</div>
    </div>
  );
};

export default Panel;
