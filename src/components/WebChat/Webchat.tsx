import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import io, { Socket } from 'socket.io-client';
import axios, { AxiosRequestConfig } from 'axios';
import Swal from 'sweetalert2';
import { Message } from '../shared';
import { OutOfHourWarningComponent } from '../molecules/InformationMessages/OutOfHourWarning/OutOfHourWarning';
import { Assistant } from '../molecules/Assistant/Assistant';
import { ChatBox } from '../molecules/ChatBox/ChatBox';
import { InputsBox } from '../molecules/InputsBox/InputsBox';
import { ChatBoxForm } from '../molecules/ChatBox/ChatBoxForm';
import { TriggerButton } from '../molecules/TriggerButton/TriggerButton';
import { FinishedConversation } from '../molecules/InformationMessages/FinishedConversation/FinishedConversation';
import { BusyAgents } from '../molecules/InformationMessages/BusyAgents/BusyAgents';

export interface webchatProps {
  fromId?: string;
  messages?: Message[];
  outOfHour?: boolean;
  uploadActive?: boolean;
  sendingMessage?: boolean;
  chatInputDialogue?: string;
  name?: string;
  email?: string;
  socket?: Socket;
  validationErrors?: string;
  isCollapsed?: boolean;
  agentName?: string;
  setUploadActive?: Dispatch<SetStateAction<boolean>>;
  setOutOfHourWarning?: Dispatch<SetStateAction<boolean>>;
  setSendingMessage?: Dispatch<SetStateAction<boolean>>;
  setChatInputDialogue?: Dispatch<SetStateAction<string>>;
  setMessages?: Dispatch<SetStateAction<Message[]>>;
  setSetingNameAndEmail?: Dispatch<SetStateAction<boolean>>;
  setConversationFinished?: Dispatch<SetStateAction<boolean>>;
  setBusyAgents?: Dispatch<SetStateAction<boolean>>;
  setIsCollapsed?: Dispatch<SetStateAction<boolean>>;
  setName?: Dispatch<SetStateAction<string>>;
  setEmail?: Dispatch<SetStateAction<string>>;
  setRUT?: Dispatch<SetStateAction<string>>;
  handleCollapse?: () => void;
  validateBusinessTime?: () => void;
}

export const WebChat: FC = function () {
  const [socket, setSocket] = useState(null);
  const [setingNameAndEmail, setSetingNameAndEmail] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [chatInputDialogue, setChatInputDialogue] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messages, setMessages] = useState([] as Message[]);
  const [uploadActive, setUploadActive] = useState(false);
  const [outOfHour, setOutOfHour] = useState(false);
  const [outOfHourWarning, setOutOfHourWarning] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [conversationFinished, setConversationFinished] = useState(false);
  const [busyAgents, setBusyAgents] = useState(false);

  // <<< Validación de Horario de Atención >>>
  const validateBusinessTime = useCallback(() => {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const currentTime = currentDate.getTime();
    // <<< HORARIO DE INICIO DE ATENCIÓN >>>
    const startTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      8,
      30,
    ).getTime();
    // <<< HORARIO DE FIN DE ATENCIÓN >>>
    const endTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      currentDayOfWeek === 5 ? 16 : 18,
      0,
    ).getTime();

    // if (
    //   currentDayOfWeek === 0 ||
    //   currentDayOfWeek === 6 ||
    //   currentTime < startTime ||
    //   currentTime > endTime
    // ) {
    //   setOutOfHour(true);
    //   setOutOfHourWarning(true);
    // }
  }, [setOutOfHour]);
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
    validateBusinessTime();
    setIsCollapsed(!isCollapsed);
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
    socket?.on('connect', () => {
      console.log('connected');
    });

    socket?.on('newMessageToWebchatUser', (arg: Message[]) => {
      setMessages(arg);
    });

    socket?.on('finishConversationForWebchat', () => {
      setMessages([]);
      sessionStorage.removeItem('chatId');
      setConversationFinished(true);
      setAgentName('');
    });

    socket?.on('agentData', (data: { name: string; id: string }) => {
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
      <div className={isCollapsed ? 'chat-container__ewc-class' : 'hidden'}>
        {outOfHourWarning && (
          <OutOfHourWarningComponent
            setOutOfHourWarning={setOutOfHourWarning}
          />
        )}
        {conversationFinished && (
          <FinishedConversation
            setConversationFinished={setConversationFinished}
            handleCollapse={handleCollapse}
          />
        )}
        {busyAgents && <BusyAgents setBusyAgents={setBusyAgents} />}

        <Assistant handleCollapse={handleCollapse} agentName={agentName} />

        {sessionStorage.getItem('webchat_elipse_name') &&
          sessionStorage.getItem('webchat_elipse_email') && (
            <>
              <ChatBox messages={messages} agentName={agentName} />
              <InputsBox
                messages={messages}
                outOfHour={outOfHour}
                uploadActive={uploadActive}
                sendingMessage={sendingMessage}
                chatInputDialogue={chatInputDialogue}
                setOutOfHourWarning={setOutOfHourWarning}
                setUploadActive={setUploadActive}
                setSendingMessage={setSendingMessage}
                setChatInputDialogue={setChatInputDialogue}
                setMessages={setMessages}
                setBusyAgents={setBusyAgents}
                validateBusinessTime={validateBusinessTime}
                socket={socket}
              />
            </>
          )}

        {(!sessionStorage.getItem('webchat_elipse_name') ||
          !sessionStorage.getItem('webchat_elipse_email')) && (
          <ChatBoxForm
            email={email}
            setEmail={setEmail}
            name={name}
            setName={setName}
            setSetingNameAndEmail={setSetingNameAndEmail}
            setMessages={setMessages}
            validateBusinessTime={validateBusinessTime}
            outOfHour={outOfHour}
            setOutOfHourWarning={setOutOfHourWarning}
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
      <TriggerButton
        handleCollapse={handleCollapse}
        isCollapsed={isCollapsed}
        agentName={agentName}
      />
    </>
  );
};
