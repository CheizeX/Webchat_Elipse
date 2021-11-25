import { FC, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import SendButton from '../../assets/send_121135.svg';
import CollapseButton from '../../assets/chevron-square-down.svg';
import UserAvatar from '../../assets/user.svg';
import { Message } from '../shared';
import { SpinnerDotted } from 'spinners-react';
import io from 'socket.io-client';
import axios, { AxiosRequestConfig } from 'axios'


export const WebChat: FC = () => {
  const [socket, setSocket] = useState(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chatInputDialogue, setChatInputDialogue] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messages, setMessages] = useState([] as Message[]);
  console.log(messages, 'MESSAGES');

  const userAvatar = processEnv.avatar
    ? processEnv.avatar : UserAvatar;

  const dialogueBoxRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    dialogueBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueBoxRef]);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInputDialogue(e.target.value);
  };

  const handleClickToSendMessage = async () => {
    setChatInputDialogue('');
    const bodyObject: Message = {
      content: chatInputDialogue || '',
    };
    try {
      setSendingMessage(true);
      const axiosConfig: AxiosRequestConfig = {
        url: 'https://rest-ailalia.ngrok.io/v1/api/webchat/sendMessageToAgent',
        method: 'post',
        data: bodyObject,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          chatId: localStorage.getItem('chatId') || '',
        }
      };
      const response = await axios(axiosConfig);
      if (response.data.success) {
        if (response?.data?.result?._id) {
          localStorage.setItem('chatId', response.data.result._id);
          socket.emit('joinWebchatUser', response.data.result.client.clientId);
          setMessages(response.data.result.messages);
        } else {
          setMessages(response.data.result);
        }
      } else {
        console.log('error', response.data.errorMessage);
      }
      setSendingMessage(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnterToSendMessage = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      setChatInputDialogue('');
      const bodyObject: Message = {
        content: chatInputDialogue || '',
      };
      try {
        setSendingMessage(true);
        const axiosConfig: AxiosRequestConfig = {
          url: 'https://rest-ailalia.ngrok.io/v1/api/webchat/sendMessageToAgent',
          method: 'post',
          data: bodyObject,
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            chatId: localStorage.getItem('chatId') || '',
          }
        };
        const response = await axios(axiosConfig);
        if (response.data.success) {
          if (response?.data?.result?._id) {
            localStorage.setItem('chatId', response.data.result._id);
            socket.emit('joinWebchatUser', response.data.result.client.clientId);
            setMessages(response.data.result.messages);
          } else {
            setMessages(response.data.result);
          }
        } else {
          console.log('error', response.data.errorMessage);
        }
        setSendingMessage(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getMessages = useCallback(async (idChat) => {
    try {
      const axiosConfig: AxiosRequestConfig = {
        url: `https://rest-ailalia.ngrok.io/v1/api/webchat/getConversation/${idChat}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios(axiosConfig);
      if (response.data.success) {
        setMessages(response.data.result);
      } else {
        console.log('error', response.data.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  }, [setMessages]);

  useEffect(scrollToBottom, [scrollToBottom, messages]);

  useEffect(() => {
    if (localStorage.getItem('chatId')) {
      const idChat = localStorage.getItem('chatId');
      getMessages(idChat);
    }
  }, []);

  useEffect(() => {
    const socket = io(processEnv.socketUrl);
    setSocket(socket);
  }, [setSocket]);

  useEffect(() => {
    socket?.on('connect', () => {
      console.log('connected');
    });

    socket?.on('newMessageToWebchatUser', (messages: Message[]) => {
      setMessages(messages);
    });

    socket?.on('finishConversationForWebchat', () => {
      localStorage.removeItem('chatId');
    });
  }, [socket]);

  return (
    <>
      <div
        className={isCollapsed ? 'chat-container' : 'hidden'}
      >
        <div className="header">
          <div className="header-button-conatiner">
            <button className="colapse-button" onClick={handleCollapse}>
              <img className="down-image" src={CollapseButton} alt="send" />
            </button>
          </div>
        </div>
        <div className="assistant">
          <img className="avatar" src={userAvatar} alt="avatar" />
          <div className="titles-container">
            <h1 className="assistant-name">{processEnv.name}</h1>
            <p className="assistant-title">
              {processEnv.description}
            </p>
          </div>
        </div>
        <div className="chat-box">
          <div className="dialogues-box">
            {messages &&
              messages?.map((message, index) => message.from !== 'AGENT' ?
                (
                  <div key={index}>
                    <div className="bot-dialogue" >
                      <div className="bot-image-container">
                        <img className="bot-image" src={userAvatar} alt="" />
                      </div>
                      <div className="bot-text-container">
                        <p
                          className="bot-text"
                        >
                          {message.content}
                        </p>
                      </div>
                    </div>
                    <div className="bot-time"> {new Date(message.createdAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: false,
                    })}</div>
                  </div>
                )
                :
                (
                  <div key={index}>
                    <div className="user-dialogue" key={index}>
                      <div className="user-dialogue-container">
                        {message.content}
                      </div>
                    </div>
                    <div className="user-time">{new Date(message.createdAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: false,
                    })}</div>
                  </div>
                )
              )
            }

            <div ref={dialogueBoxRef} />
          </div>
        </div>
        <div className="input-container">
          <input
            disabled={sendingMessage}
            type="text"
            className="chat-input"
            placeholder={sendingMessage ? "" : "Envía un mensaje..."}
            value={chatInputDialogue}
            onChange={handleInputChange}
            onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => handleEnterToSendMessage(e)}
          />
          {
            sendingMessage ?
              (<button className="send-button disabled-button" onClick={handleClickToSendMessage} disabled>
                <SpinnerDotted size={30} thickness={120} speed={104} color="#f5f5f5" />
              </button>)
              :
              (<button className="send-button" onClick={handleClickToSendMessage}>
                <img className="send-image" src={SendButton} alt="send" />
              </button>)
          }
        </div>
        <div className="footer">
          <a href="#_blank" className="footer-button">
            Powered by Elipse
          </a>
        </div>
      </div>
      <button
        className={!isCollapsed ? 'button-trigger' : 'hidden'}
        onClick={handleCollapse}>
        <img
          className="trigger-avatar"
          src={userAvatar}
          alt=""
        />
      </button>
    </>
  );
};

export default WebChat;