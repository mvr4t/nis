import React from "react";
import Feature from "../Features/Feature";
import { MdGppGood, MdLibraryAddCheck, MdLock, MdShare } from "react-icons/md";

const Features = () => {
  return (
    <div className="features-wrapper">
      <div className="title-large">Amazing Features</div>
      <div className="title-small">
        New technologies and opportunities have also come to NIS
      </div>

      <div className="mobile-wrapper">
        <div>
          <Feature title="Voting" icon={<MdLock />} align="right">
            <p>
              Now you are able to vote in presidential or other elections online
              and with complete security.
            </p>
          </Feature>
        </div>

        <div className="mobile-container">
          
        </div>

        <div>
          <Feature title="Enhanced Security" icon={<MdGppGood />} align="left">
            <p>
              Immutability means something that can’t be changed or altered.
              This is one of the top blockchain features that help to ensure
              that the technology will remain as it is, a permanent, unalterable
              network.
            </p>
          </Feature>
        </div>
        <div>
          <Feature title="Decentralized" icon={<MdShare />} align="right">
            <p>
            Decentralization is the distribution of functions, control 
            and information instead of centralizing them in a single entity.
            </p>
          </Feature>
        </div>
        <div>
          <Feature
            title="Choice"
            icon={<MdLibraryAddCheck />}
            align="left"
          >
            <p>
              Choose your class group, curators, teachers for your subjects!
            </p>
          </Feature>
        </div>
      </div>
    </div>
  );
};

export default Features;
