import { Dispatch, SetStateAction } from 'react';
import { Socket } from 'socket.io-client';
import { Message } from '../shared';

export interface webchatProps {
  fromId?: string;
  messages?: Message[];
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
  automatedMessages?: Message[];
  outOfHourWarning?: boolean;
  outOfHourMessage?: string;
  setOutOfHourMessage?: Dispatch<SetStateAction<string>>;
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
  handleSendMessage?: (arg?: Message[], texto?: string) => void;
}
