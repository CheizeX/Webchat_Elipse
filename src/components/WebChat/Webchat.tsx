import React, {
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SpinnerDotted } from 'spinners-react';
import io from 'socket.io-client';
import axios, { AxiosRequestConfig } from 'axios';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import SendButton from '../../assets/send_121135.svg';
import CollapseButton from '../../assets/chevron-square-down.svg';
import RobotAvatar from '../../assets/robot.svg';
import { Message } from '../shared';

export const WebChat: FC = function () {
  const [socket, setSocket] = useState(null);

  const dialogueBoxRef = useRef<HTMLDivElement>(null);

  const [setingNameAndEmail, setSetingNameAndEmail] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [validationErrors, setValidationErrors] = useState('');
  const [chatInputDialogue, setChatInputDialogue] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messages, setMessages] = useState([] as Message[]);

  // <<< Event Handlers >>>
  const handleCollapse = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  const handleInputWebchatChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setChatInputDialogue(e.target.value);
  };

  const handleLocaleStorageName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleLocaleStorageEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required('Debe introducir su Email')
      .email('Debe introducir un Email válido'),
    name: yup
      .string()
      .required('Debe introducir su Nombre')
      .min(3, 'El Nombre debe tener 3 caracteres como mínimo'),
  });

  const handleSetNameAndEmailOnLocaleStorage = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await validationSchema.validate({ email, name });
      localStorage.setItem('webchat_elipse_name', name);
      localStorage.setItem('webchat_elipse_email', email);
      setSetingNameAndEmail(true);
      setValidationErrors('');
    } catch (err) {
      setValidationErrors(err.errors[0]);
    }
  };

  // <<< useCallback functions >>>
  const handleSendMessage = useCallback(async () => {
    if (socket.connected) {
      setChatInputDialogue('');
      const bodyObject: Message = {
        content: chatInputDialogue || '',
        infoUser: `${name} - ${email}`,
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
          },
        };
        const response = await axios(axiosConfig);
        if (response.data.success) {
          if (response?.data?.result?._id) {
            localStorage.setItem('chatId', response.data.result._id);
            socket.emit(
              'joinWebchatUser',
              response.data.result.client.clientId,
            );
            setMessages(response.data.result.messages);
          } else {
            setMessages(response.data.result);
          }
        } else {
          Swal.fire({
            title:
              'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
            confirmButtonText: 'OK',
            confirmButtonColor: processEnv.mainColor,
            imageUrl: RobotAvatar,
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: 'Custom image',
            customClass: {
              popup: 'animated animate__fadeInDown',
            },
          });
        }
        setSendingMessage(false);
      } catch (error) {
        Swal.fire({
          title:
            'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
          confirmButtonText: 'OK',
          confirmButtonColor: processEnv.mainColor,
          imageUrl: RobotAvatar,
          imageWidth: 100,
          imageHeight: 100,
          imageAlt: 'Custom image',
          customClass: {
            popup: 'animated animate__fadeInDown',
          },
        });
      }
    } else {
      Swal.fire({
        title:
          'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
        confirmButtonText: 'OK',
        confirmButtonColor: processEnv.mainColor,
        imageUrl: RobotAvatar,
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Custom image',
        customClass: {
          popup: 'animated animate__fadeInDown',
        },
      });
    }
  }, [chatInputDialogue, socket, name, email]);

  const handleEnterToSendMessage = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleClcikToSendMessage = () => {
    handleSendMessage();
  };

  const getMessages = useCallback(
    async (idChat) => {
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
    },
    [setMessages],
  );

  const scrollToBottom = useCallback(() => {
    dialogueBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueBoxRef]);

  // <<< useEffect instances >>>
  useEffect(scrollToBottom, [scrollToBottom, messages]);

  useEffect(() => {
    if (localStorage.getItem('chatId')) {
      const idChat = localStorage.getItem('chatId');
      getMessages(idChat);
    }
  }, [getMessages]);

  useEffect(() => {
    const socketConnection = io(processEnv.socketUrl);
    setSocket(socketConnection);
  }, [setSocket]);

  useEffect(() => {
    // socket?.on('connect', () => {
    //   console.log('connected');
    // });
    socket?.on('newMessageToWebchatUser', () => {
      setMessages(messages);
    });
    socket?.on('finishConversationForWebchat', () => {
      localStorage.removeItem('chatId');
    });
  }, [socket, setingNameAndEmail, messages]);

  return (
    <>
      <div className={isCollapsed ? 'chat-container' : 'hidden'}>
        <div className="header">
          <div className="header-button-conatiner">
            <button
              type="button"
              className="colapse-button"
              onClick={handleCollapse}>
              <img className="down-image" src={CollapseButton} alt="send" />
            </button>
          </div>
        </div>
        <div className="assistant">
          <img className="avatar" src={RobotAvatar} alt="avatar" />
          <div className="titles-container">
            <h1 className="assistant-name">{processEnv.name}</h1>
            <p className="assistant-title">{processEnv.description}</p>
          </div>
        </div>

        {localStorage.getItem('webchat_elipse_name') &&
          localStorage.getItem('webchat_elipse_email') && (
            <>
              <div className="chat-box">
                <div className="dialogues-box">
                  <div key="0">
                    <div className="bot-dialogue">
                      <div className="bot-image-container">
                        <img className="bot-image" src={RobotAvatar} alt="" />
                      </div>
                      <div className="bot-text-container">
                        <p className="bot-text">
                          Hola {localStorage.getItem('webchat_elipse_name')}
                          !. Mi nombre es {processEnv.name} y estoy para leer
                          tus preguntas y resolver tus dudas. ¿En qué puedo
                          ayudarte?
                        </p>
                      </div>
                    </div>
                    <div className="bot-time">
                      {' '}
                      {new Date().toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </div>
                  </div>
                  {messages &&
                    messages?.map((message) =>
                      message.from === 'AGENT' ? (
                        <div>
                          <div className="bot-dialogue">
                            <div className="bot-image-container">
                              <img
                                className="bot-image"
                                src={RobotAvatar}
                                alt=""
                              />
                            </div>
                            <div className="bot-text-container">
                              <p className="bot-text">{message.content}</p>
                            </div>
                          </div>
                          <div className="bot-time">
                            {' '}
                            {new Date(message.createdAt).toLocaleTimeString(
                              'en-US',
                              {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                              },
                            )}
                          </div>
                        </div>
                      ) : (
                        <div key={message._id}>
                          <div className="user-dialogue">
                            <div className="user-dialogue-container">
                              {message.content}
                            </div>
                          </div>
                          <div className="user-time">
                            {new Date(message.createdAt).toLocaleTimeString(
                              'en-US',
                              {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                              },
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  <div ref={dialogueBoxRef} />
                </div>
              </div>
              <div className="input-container">
                <input
                  disabled={sendingMessage}
                  type="text"
                  className="chat-input"
                  placeholder={sendingMessage ? '' : 'Envía un mensaje...'}
                  value={chatInputDialogue}
                  onChange={handleInputWebchatChange}
                  onKeyPress={(e: KeyboardEvent<HTMLInputElement>) =>
                    handleEnterToSendMessage(e)
                  }
                />
                {sendingMessage ? (
                  <button
                    type="button"
                    className="send-button disabled-button"
                    onClick={handleClcikToSendMessage}
                    disabled>
                    <SpinnerDotted
                      size={30}
                      thickness={120}
                      speed={104}
                      color="#f5f5f5"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="send-button"
                    onClick={handleClcikToSendMessage}>
                    <img className="send-image" src={SendButton} alt="send" />
                  </button>
                )}
              </div>
            </>
          )}

        {(!localStorage.getItem('webchat_elipse_name') ||
          !localStorage.getItem('webchat_elipse_email')) && (
          <div className="chat-box-without-name-and-email">
            <div className="without-header">
              <div className="without-welcome">Bienvenido!</div>
              <div className="without-information">
                Para poder iniciar la conversación completa los siguientes
                campos
              </div>
            </div>
            <form className="without-body">
              <input
                type="text"
                className={
                  validationErrors.includes('Nombre')
                    ? 'inp-control inp-control-error'
                    : 'inp-control'
                }
                placeholder="Nombre"
                onChange={handleLocaleStorageName}
              />
              <input
                type="email"
                className={
                  validationErrors.includes('Email')
                    ? 'inp-control inp-control-error'
                    : 'inp-control'
                }
                placeholder="Email"
                onChange={handleLocaleStorageEmail}
              />
              <p className="error-message">{validationErrors}</p>
              <input
                type="submit"
                className="but-control"
                value="ENVIAR"
                onClick={(e) => handleSetNameAndEmailOnLocaleStorage(e)}
              />
            </form>
          </div>
        )}

        <div className="footer">
          <a
            href="https://elipse.ai/elipse-chat/"
            target="_blank"
            className="footer-button"
            rel="noreferrer">
            Powered by Elipse
          </a>
        </div>
      </div>
      <button
        type="button"
        className={!isCollapsed ? 'button-trigger' : 'hidden'}
        onClick={handleCollapse}>
        <img className="trigger-avatar" src={RobotAvatar} alt="" />
      </button>
    </>
  );
};
