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
  base64Avatar?: string;
  svgBack?: any;
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
  const [svgI, setSvgI] = useState('');
  const [svgBack, setSvgBack] = useState({});
  const [loading, setLoading] = useState(false);

  const getAvatar = useCallback(async () => {
    const { data }: any = await axios.get(processEnv.avatar);
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
      const { data }: any = await axios(axiosConfig);
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
      {!loading && (
        <div className={isCollapsed ? 'chat-container__ewc-class' : 'hidden'}>
          {outOfHourWarning && (
            <OutOfHourWarningComponent
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
            <BusyAgents setBusyAgents={setBusyAgents} svgBack={svgBack} />
          )}

          <Assistant
            handleCollapse={handleCollapse}
            agentName={agentName}
            base64Avatar={svgI}
            svgBack={svgBack}
          />

          {sessionStorage.getItem('webchat_elipse_name') &&
            sessionStorage.getItem('webchat_elipse_email') && (
              <>
                <ChatBox
                  messages={messages}
                  agentName={agentName}
                  base64Avatar={svgI}
                  svgBack={svgBack}
                />
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
                  // validateBusinessTime={validateBusinessTime}
                  socket={socket}
                  svgBack={svgBack}
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
              // validateBusinessTime={validateBusinessTime}
              outOfHour={outOfHour}
              setOutOfHourWarning={setOutOfHourWarning}
              svgBack={svgBack}
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
