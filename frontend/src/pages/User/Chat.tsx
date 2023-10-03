import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/Auth'; // Update the path to your AuthContext
import { MultiChatSocket, useMultiChatLogic } from 'react-chat-engine-advanced';
import { ChatSettings, ChatFeed } from 'react-chat-engine-advanced';

const Chat = (): JSX.Element => {
  const authContext = useContext(AuthContext);

  const projectID: string = "ebf810db-a728-45d2-bb20-894fcae82e5f";
  const username = authContext.FirstName.toString();
  const secret = authContext.email.toString();


  const chatProps = useMultiChatLogic(projectID, username, secret);



  return (
    <div className='chat-container'>
      <MultiChatSocket {...chatProps} />
      <div className='ce-chat-engine'>
        <div className='ce-chat-feed'>
          <ChatFeed {...chatProps} />
        </div>
        <div className='ce-chat-settings'>
          <ChatSettings {...chatProps} optionsSettingsStyle={{ display: "none" }} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
