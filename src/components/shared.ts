/* eslint-disable no-restricted-syntax */
export enum Channels {
  WHATSAPP = 'WhatsApp',
  MESSENGER = 'Messenger',
  INSTAGRAM = 'Instagram',
  WEBCHAT = 'Webchat',
}
export enum ChatStatus {
  ASSIGNMENT_PENDING = 'ASSIGNMENT_PENDING',
  ON_CONVERSATION = 'ON_CONVERSATION',
  FINISHED = 'FINISHED',
}
export enum UserStatus {
  AVAILABLE = 'AVAILABLE',
  DISCONNECTED = 'DISCONNECTED',
  BATHROOM = 'BATHROOM',
  LUNCH = 'LUNCH',
  CALL = 'CALL',
  ALL = 'ALL',
}
export enum UserRole {
  SUPERVISOR = 'SUPERVISOR',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}
export enum ChatFinishedStatus {
  SATISFACTORY = 'SATISFACTORY',
  UNSATISFACTORY = 'UNSATISFACTORY',
}
export enum StatusAgent {
  AVAILABLE = 'AVAILABLE',
  BATHROOM = 'BATHROOM',
  LUNCH = 'LUNCH',
}
export enum ContentTypes {
  TEXT = 'TEXT',
  ATTACHMENT = 'ATTACHMENT',
}
export type Tag = {
  _id?: string;
  name: string;
  color: string;
};
export enum MessageFrom {
  AGENT = 'AGENT',
  USER = 'USER',
  BOT = 'Bot',
}

export type User = {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  tags: Tag[] | undefined;
  status?: UserStatus;
  urlAvatar?: string;
};

export type Client = {
  _id: string;
  clientId: string;
  name: string;
  profilePic?: string;
};

export type Message = {
  infoUser?: string;
  from?: string;
  content: string;
  name?: string;
  contentType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  size?: string;
  _id?: string;
  mid?: string;
  isDeleted?: boolean;
  icon?: string;
  link?: string;
};

export type Chat = {
  _id: string;
  channel: Channels;
  client: Client;
  status: ChatStatus;
  companyId: string;
  fromLaravel: boolean;
  assignedAgent: User;
  messages: Message[];
  tags: Tag[];
  isTransfer: boolean;
  isPaused: boolean;
  unreadMessages: number;
  selected: boolean;
  createdAt: Date;
  updatedAt: Date;
  finishedStatus?: ChatFinishedStatus;
  feedback?: string;
};

export interface OptionsSuggestionsProps {
  icon?: string;
  link?: string;
  text?: string;
}
export interface SubItemsSuggestionsProps {
  icon?: string;
  link?: string;
  text?: string;
}
export enum DERIVATIONS {
  AGENT = 'agent',
  FORM = 'form',
  LINK = 'link',
}
export enum FormTypes {
  TEXT = 'text',
  DATE = 'date',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  PASSWORD = 'password',
  // EMAIL = 'email',
  TEL = 'tel',
}
export interface FormProps {
  name: string;
  type: FormTypes;
  placeholder?: string;
  value?: string;
}
export interface SuggestionsProps {
  icon?: string;
  name?: string;
  options?: OptionsSuggestionsProps[];
  subItems?: SubItemsSuggestionsProps[];
  question?: string;
  derivation?: DERIVATIONS;
  derivationLink?: string;
  derivationForm?: FormProps[];
}

// TIME AGO --------------
const DATE_UNITS = {
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};

const getSecondsDiff = (timestamp: number) => (Date.now() - timestamp) / 1000;
const getUnitAndValueDate = (secondsElapsed: number) => {
  for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
    if (secondsElapsed >= secondsInUnit || unit === 'second') {
      const value = Math.floor(secondsElapsed / secondsInUnit) * -1;
      return { value, unit };
    }
  }
  return {};
};

export const getTimeAgo = (timestamp: number) => {
  const rtf = new Intl.RelativeTimeFormat();
  const secondsElapsed = getSecondsDiff(timestamp);
  const { value, unit } = getUnitAndValueDate(secondsElapsed) as any;
  return rtf.format(value, unit);
};
// -----------
