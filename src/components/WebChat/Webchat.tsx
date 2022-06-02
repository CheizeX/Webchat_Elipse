/* eslint-disable no-nested-ternary */
import React, { FC, useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios, { AxiosRequestConfig } from 'axios';
import Swal from 'sweetalert2';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { VscListSelection } from 'react-icons/vsc';
import { MdOutlineSupportAgent } from 'react-icons/md';
import { Message } from '../shared';
import { OutOfHourWarningComponent } from '../molecules/InformationMessages/OutOfHourWarning/OutOfHourWarning';
import { Assistant } from '../molecules/Assistant/Assistant';
import { ChatBox } from '../molecules/ChatBox/ChatBox';
import { InputsBox } from '../molecules/InputsBox/InputsBox';
import { ChatBoxForm } from '../molecules/ChatBox/ChatBoxForm';
import { TriggerButton } from '../molecules/TriggerButton/TriggerButton';
import { FinishedConversation } from '../molecules/InformationMessages/FinishedConversation/FinishedConversation';
import { BusyAgents } from '../molecules/InformationMessages/BusyAgents/BusyAgents';
import { BotBox } from '../molecules/BotBox/BotBox';
import { initialMessage } from '../extra';
import { webchatProps } from './webchat.interface';
import { Confirmation } from '../molecules/InformationMessages/Confirmation/Confirmation';

export const WebChat: FC<webchatProps> = function () {
  const [socket, setSocket] = useState(null);
  const [setingNameAndEmail, setSetingNameAndEmail] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [chatInputDialogue, setChatInputDialogue] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messages, setMessages] = useState([] as Message[]);
  const [uploadActive, setUploadActive] = useState(false);
  const [outOfHourWarning, setOutOfHourWarning] = useState(false);
  const [outOfHourMessage, setOutOfHourMessage] = useState('');
  const [agentName, setAgentName] = useState(
    sessionStorage.getItem('webchat_elipse_agent_name') || '',
  );
  const [conversationFinished, setConversationFinished] = useState(false);
  const [busyAgents, setBusyAgents] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [svgI, setSvgI] = useState('');
  const [svgBack, setSvgBack] = useState({});
  const [loading, setLoading] = useState(false);
  const [toggleBotWithAgent, setToggleBotWithAgent] = useState(true);
  const [automatedMessages, setAutomatedMessages] = useState<Message[]>(
    !sessionStorage.getItem('chatId') && initialMessage,
  );
  const [formFieldsAndAutomatedMessages, setFormFieldsAndAutomatedMessages] =
    useState<Message[]>([]);

  console.log(
    '[FORM FIELDS AND AUTOMATED MESSAGES]',
    formFieldsAndAutomatedMessages,
  );
  console.log('[AUTOMATED MESSAGES]', automatedMessages);

  const getAvatar = useCallback(async () => {
    const { data } = await axios.get(processEnv.avatar);
    setSvgI(data);
  }, []);

  const getAllImages = useCallback(async () => {
    setLoading(true);
    try {
      const axiosConfig: AxiosRequestConfig = {
        url: `${processEnv.restUrl}/webchat/webchatFiles/icons`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios(axiosConfig);
      setSvgBack(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getMessages = useCallback(
    async (idChat) => {
      try {
        const axiosConfig: AxiosRequestConfig = {
          url: `${processEnv.restUrl}/webchat/getConversation/${idChat}`,
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const response = await axios(axiosConfig);
        if (response.data.success) {
          setMessages(response.data.result);
        } else {
          Swal.fire({
            title:
              'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
            confirmButtonText: 'OK',
            confirmButtonColor: processEnv.mainColor,
            customClass: {
              popup: 'animated animate__fadeInDown',
            },
          });
        }
      } catch (error) {
        Swal.fire({
          title:
            'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
          confirmButtonText: 'OK',
          confirmButtonColor: processEnv.mainColor,
          customClass: {
            popup: 'animated animate__fadeInDown',
          },
        });
      }
    },
    [setMessages],
  );

  const handleCollapse = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSendMessage = useCallback(
    async (botInteractedMessages?: Message[]) => {
      if (socket.connected) {
        setChatInputDialogue('');
        // Objeto para el valor del input
        const bodyObject: Message = {
          content: chatInputDialogue,
          infoUser: `${sessionStorage?.getItem(
            'webchat_elipse_name',
          )} - ${sessionStorage?.getItem('webchat_elipse_email')}`,
        };
        // Objeto para el contenido de la interacción con el bot
        const bodyObjectArray = {
          content: botInteractedMessages || '',
          infoUser: `${sessionStorage?.getItem(
            'webchat_elipse_name',
          )} - ${sessionStorage?.getItem('webchat_elipse_email')}`,
        };

        try {
          setSendingMessage(true);
          const axiosConfig: AxiosRequestConfig = {
            url: `${processEnv.restUrl}/webchat/sendMessageToAgent`,
            method: 'post',
            data: sessionStorage.getItem('chatId')
              ? bodyObject
              : bodyObjectArray,
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              chatId: sessionStorage.getItem('chatId'),
              companyId: processEnv.companyId,
            },
          };

          const response = await axios(axiosConfig);
          if (response.data.success) {
            if (response?.data?.result?._id) {
              sessionStorage.setItem('chatId', response.data.result._id);
              socket.emit(
                'joinWebchatUser',
                response.data.result.client.clientId,
              );
              setMessages(response.data.result.messages);
            } else {
              setMessages(response.data.result);
            }
          } else if (response?.data.errorMessage) {
            const errorMess = response.data.errorMessage;
            const ailaliaError = response.data.ailaliaErrorCode;

            if (errorMess === 'Agents not available') {
              setMessages(response.data.chat.result.messages);
              setBusyAgents(true);
            }

            if (ailaliaError === 'Out of time') {
              setOutOfHourMessage(
                errorMess === 'Not setted'
                  ? 'En este momento no podemos atenderte, por favor comunícate dentro de nuestro horario de atención, muchas gracias.'
                  : errorMess,
              );
              sessionStorage.setItem('outOfHour', 'true');
              setOutOfHourWarning(true);
            }
          } else {
            Swal.fire({
              title:
                'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
              confirmButtonText: 'OK',
              confirmButtonColor: processEnv.mainColor,
              customClass: {
                popup: 'animated animate__fadeInDown',
              },
            });
          }
          setSendingMessage(false);
        } catch (error) {
          console.log('entra', error);
          Swal.fire({
            title:
              'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
            confirmButtonText: 'OK',
            confirmButtonColor: processEnv.mainColor,
            customClass: {
              popup: 'animated animate__fadeInDown',
            },
          });
          setSendingMessage(false);
        }
      } else {
        Swal.fire({
          title:
            'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
          confirmButtonText: 'OK',
          confirmButtonColor: processEnv.mainColor,
          customClass: {
            popup: 'animated animate__fadeInDown',
          },
        });
      }
    },
    [
      chatInputDialogue,
      socket,
      setMessages,
      setChatInputDialogue,
      setSendingMessage,
      setBusyAgents,
    ],
  );

  const handleBackToBot = () => {
    setToggleBotWithAgent(false);
    setFormFieldsAndAutomatedMessages([]);
  };
  const handleBackToForward = () => {
    setToggleBotWithAgent(true);
  };

  useEffect(() => {
    if (sessionStorage.getItem('chatId')) {
      const idChat = sessionStorage.getItem('chatId');
      getMessages(idChat);
    }
  }, [getMessages]);

  useEffect(() => {
    const socketConnection = io(processEnv.socketUrl);
    setSocket(socketConnection);
  }, [setSocket]);

  useEffect(() => {
    getAvatar();
    getAllImages();
  }, []);

  useEffect(() => {
    socket?.on('connect', () => {
      console.log('connected');
    });

    socket?.on('newMessageToWebchatUser', (arg: Message[]) => {
      setMessages(arg);
    });

    socket?.on('finishConversationForWebchat', () => {
      setMessages([]);
      sessionStorage.removeItem('chatId');
      sessionStorage.removeItem('webchat_elipse_name');
      sessionStorage.removeItem('webchat_elipse_email');
      setConversationFinished(true);
      setAgentName('');
    });

    socket?.on('agentData', (data: { name: string; id: string }) => {
      sessionStorage.setItem('webchat_elipse_agent_name', data.name);
      setAgentName(data.name);
    });

    if (sessionStorage.getItem('webchat_elipse_email')) {
      socket?.emit(
        'joinWebchatUser',
        sessionStorage.getItem('webchat_elipse_email'),
      );
    }
  }, [socket, setingNameAndEmail, messages]);

  return (
    <>
      {!loading && (
        <div className={isCollapsed ? 'chat-container__ewc-class' : 'hidden'}>
          {outOfHourWarning && (
            <OutOfHourWarningComponent
              setOutOfHourMessage={setOutOfHourMessage}
              outOfHourMessage={outOfHourMessage}
              setOutOfHourWarning={setOutOfHourWarning}
              svgBack={svgBack}
            />
          )}
          {conversationFinished && (
            <FinishedConversation
              setConversationFinished={setConversationFinished}
              handleCollapse={handleCollapse}
              svgBack={svgBack}
            />
          )}
          {busyAgents && (
            <BusyAgents
              setBusyAgents={setBusyAgents}
              svgBack={svgBack}
              handleSendMessage={handleSendMessage}
              formFieldsAndAutomatedMessages={formFieldsAndAutomatedMessages}
              automatedMessages={automatedMessages}
            />
          )}
          {confirmation && sessionStorage.getItem('chatId') && (
            <Confirmation
              setConfirmation={setConfirmation}
              svgBack={svgBack}
              handleSendMessage={handleSendMessage}
              formFieldsAndAutomatedMessages={formFieldsAndAutomatedMessages}
              automatedMessages={automatedMessages}
            />
          )}

          <Assistant
            handleCollapse={handleCollapse}
            agentName={agentName}
            base64Avatar={svgI}
            svgBack={svgBack}
          />
          {/* {toggleBotWithAgent && (
            <div className="without-header-back-container__ewc-class">
              <button
                type="button"
                className="back-button__ewc-class"
                onClick={handleBackToBot}>
                <IoIosArrowBack />

                <div>
                  {' '}
                  <VscListSelection />{' '}
                </div>
                <span />
              </button>
            </div>
          )} */}
          {!toggleBotWithAgent && sessionStorage.getItem('chatId') && (
            <div className="without-header-back-container__ewc-class">
              <button
                type="button"
                className="back-button__ewc-class"
                onClick={handleBackToForward}>
                <IoIosArrowForward />

                <div>
                  {' '}
                  <MdOutlineSupportAgent />{' '}
                </div>
                <span />
              </button>
            </div>
          )}
          {sessionStorage.getItem('webchat_elipse_name') &&
            sessionStorage.getItem('webchat_elipse_email') &&
            toggleBotWithAgent && (
              <>
                <ChatBox
                  messages={messages}
                  agentName={agentName}
                  base64Avatar={svgI}
                  svgBack={svgBack}
                />
                <InputsBox
                  messages={messages}
                  uploadActive={uploadActive}
                  sendingMessage={sendingMessage}
                  chatInputDialogue={chatInputDialogue}
                  outOfHourWarning={outOfHourWarning}
                  setOutOfHourWarning={setOutOfHourWarning}
                  setUploadActive={setUploadActive}
                  setSendingMessage={setSendingMessage}
                  setChatInputDialogue={setChatInputDialogue}
                  setMessages={setMessages}
                  setBusyAgents={setBusyAgents}
                  socket={socket}
                  svgBack={svgBack}
                  handleSendMessage={handleSendMessage}
                />
              </>
            )}

          {!toggleBotWithAgent && (
            <BotBox
              handleSendMessage={handleSendMessage}
              setToggleBotWithAgent={setToggleBotWithAgent}
              automatedMessages={automatedMessages}
              setAutomatedMessages={setAutomatedMessages}
              base64Avatar={svgI}
              setFormFieldsAndAutomatedMessages={
                setFormFieldsAndAutomatedMessages
              }
              setConfirmation={setConfirmation}
            />
          )}

          {(!sessionStorage.getItem('webchat_elipse_name') ||
            !sessionStorage.getItem('webchat_elipse_email')) &&
            toggleBotWithAgent && (
              <ChatBoxForm
                email={email}
                setEmail={setEmail}
                name={name}
                setName={setName}
                setSetingNameAndEmail={setSetingNameAndEmail}
                setMessages={setMessages}
                automatedMessages={automatedMessages}
                handleSendMessage={handleSendMessage}
                setOutOfHourWarning={setOutOfHourWarning}
                svgBack={svgBack}
                formFieldsAndAutomatedMessages={formFieldsAndAutomatedMessages}
                // setToggleBotWithAgent={setToggleBotWithAgent}
                // toggleBotWithAgent={toggleBotWithAgent}
              />
            )}

          <div className="footer__ewc-class">
            <a
              href="https://elipse.ai/elipse-chat/#preciosyplanes"
              target="_blank"
              className="footer-button"
              rel="noreferrer">
              Powered by Elipse
            </a>
          </div>
        </div>
      )}
      {!loading && (
        <TriggerButton
          base64Avatar={svgI}
          handleCollapse={handleCollapse}
          isCollapsed={isCollapsed}
          agentName={agentName}
          svgBack={svgBack}
        />
      )}
    </>
  );
};
