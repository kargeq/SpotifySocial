import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Conversation,
  ConversationList,
  Sidebar,
  Search,
  ConversationHeader,
  AddUserButton,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { CardContent } from "@mui/material";
import { useState } from "react";
import NavigationBar from "../Navbar";
import NewChat from "./NewChat";
import { useContext } from "react";
import { useEffect } from "react";
import { AppStateContext } from "../../AppState";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}
const Chat = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { appState, setAppState } = useContext(AppStateContext);
  let email = appState.user;
  if (!appState.user) {
    email = localStorage.getItem("email");
  }
  let myUSERNAME = localStorage.getItem("userName");

  const getUser = (users) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email !== email) {
        return users[i];
      }
    }
    return null; // Return null if no user with matching email is found
  };
  const [DocIds, setDocIds]=useState([])
  const [isNewperson, setIsNewPerson] = useState(false);
  const [conversation, setConversation] = useState(undefined);
  const [messages, setMessages] = useState([

  ]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/database/getMessages?username=${myUSERNAME}&email=${email}`
        );
        setMessages(res.data.responseData.conversations);
        setDocIds(res.data.responseData.DocIds)
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);

  const [messageInputValue, setMessageInputValue] = useState("");
  let indexOFMESSAGEFORUSER = messages.findIndex((element) => {
    return getUser(element.users).userName === conversation;
  });


  const updateMessage = async() => {
    const getMsg = messageInputValue;
    const newMessagePage = [...messages[indexOFMESSAGEFORUSER].messages];
    newMessagePage.push({
      message: getMsg,
      sender: email,
      position: "single",
    });
    const updatedValue = {
      ...messages[indexOFMESSAGEFORUSER],
      messages: newMessagePage,
    };

    if (newMessagePage.length===1){

      try {
        // Make an HTTP request to the Express.js backend using Axios
        const response = await axios.post('http://localhost:3000/database/new-chat', { newObject:updatedValue, id:DocIds[indexOFMESSAGEFORUSER] });
        // Handle the response and update the UI

        console.log(response.data);
     
      } catch (error) {
        // Handle any errors
        console.error(error);
      }






    }else{
      try {
        // Make an HTTP request to the Express.js backend using Axios
        const response = await axios.post('http://localhost:3000/database/addMessageExisting', { messageUpdated:updatedValue, id:DocIds[indexOFMESSAGEFORUSER] });
        // Handle the response and update the UI
      } catch (error) {
        // Handle any errors
        console.error(error);
      }
    }





  

///put axios call


    const newArray = [...messages];
    newArray[indexOFMESSAGEFORUSER] = updatedValue;
    setMessages(newArray);
    setMessageInputValue("");
  };

  const getInfoAndLastSender = (element) => {
    const index = messages.findIndex((object) => {
      return element.sender === getUser(object.users).email;
    });

    return {
      lastSenderName:
        index === -1 ? "YOU" : getUser(messages[index].users).userName,
      info: element.message,
    };
  };

  const CheckIfanyMessages = (messages) => {
    if (messages.length === 0) {
      return {};
    } else {
      return getInfoAndLastSender(messages[messages.length - 1]);
    }
  };

  const newUserSelected = () => {
    const newMessages = [...messages];

    newMessages.unshift({
      users: [{
        email: localStorage.getItem("newUSEREmail"),
        userName: localStorage.getItem("newUSERNAME"),
      },{email: email,
      userName: myUSERNAME}],
      messages: [],
    });
  

 
    const id=generateRandomString()

    const newDocId=[...DocIds]
    newDocId.unshift(id)
    setDocIds(newDocId)
    setMessages(newMessages);
    setIsNewPerson(false);

    setConversation(localStorage.getItem("newUSERNAME"));
  };

  return (
    <>
      <NavigationBar page="chat" />
      <div className="view-container">
        <MainContainer
          style={{
            display: isNewperson ? "block" : "",
            borderRadius: "5px",
            marginTop: "40px",
            height: "80vh",
            width: "90vw",
            marginLeft: "-3vw",
          }}
        >
          {!isNewperson ? (
            <>
              <Sidebar position="left" scrollable={true}>
                {isMobile && (
                  <AddUserButton
                    onClick={() => {
                      setIsNewPerson(true);
                    }}
                  />
                )}
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {" "}
                  <Search placeholder="Search..." />
                  {!isMobile && (
                    <AddUserButton
                      onClick={() => {
                        setIsNewPerson(true);
                      }}
                    />
                  )}
                </CardContent>

                <ConversationList>
                  {messages.map((element) => {
                    return (
                      <Conversation
                        key={getUser(element.users).userName}
                        name={getUser(element.users).userName}
                        {...CheckIfanyMessages(element.messages)}
                        onClick={() =>
                          setConversation(getUser(element.users).userName)
                        }
                        active={
                          conversation === getUser(element.users).userName
                        }
                      />
                    );
                  })}
                </ConversationList>
              </Sidebar>
              <ChatContainer>
                {conversation !== undefined && (
                  <ConversationHeader>
                    <ConversationHeader.Content>
                      <span
                        style={{
                          color: "#36342f",
                          alignSelf: "flex-center",
                        }}
                      >
                        {conversation}
                      </span>
                    </ConversationHeader.Content>
                  </ConversationHeader>
                )}
                <MessageList>
                  {indexOFMESSAGEFORUSER >= 0 &&
                    messages[indexOFMESSAGEFORUSER].messages.map((element) => {
                      return (
                        <Message
                          model={{
                            message: element.message,
                            sentTime: "15 mins ago",
                            sender: element.sender,
                            direction:
                              email !== element.sender
                                ? "incoming"
                                : "outgoing",
                            position: "single",
                          }}
                        ></Message>
                      );
                    })}
                </MessageList>

                {indexOFMESSAGEFORUSER >= 0 && (
                  <MessageInput
                    placeholder="Type message here"
                    value={messageInputValue}
                    onChange={(val) => setMessageInputValue(val)}
                    onSend={updateMessage}
                  />
                )}
              </ChatContainer>
            </>
          ) : (
            <NewChat
              goBack={() => {
                setIsNewPerson(false);
              }}
              messages={messages}
              onSubmit={newUserSelected}
            />
          )}
        </MainContainer>
      </div>
    </>
  );
};

export default Chat;
