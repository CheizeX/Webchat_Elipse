// import React, {
//   FC,
//   KeyboardEvent,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import { SpinnerDotted } from 'spinners-react';
// import io from 'socket.io-client';
// import axios, { AxiosRequestConfig } from 'axios';
// import * as yup from 'yup';
// import Swal from 'sweetalert2';
// import SendButton from '../../assets/send_121135.svg';
// import CollapseButton from '../../assets/chevron-square-down.svg';
// import RobotAvatar from '../../assets/robot.svg';
// import { Message } from '../shared';
// import { UploadFiles } from '../UploadFiles/UploadFiles';
// import ImageIcon from '../../assets/image-icon.svg';
// import PdfIcon from '../../assets/pdf-icon.svg';

// export interface webchatProps {
//   fromId?: string;
//   setUploadActive?: (uploadActive: boolean) => void;
// }

// export const WebChat: FC = function () {
//   const [socket, setSocket] = useState(null);

//   const dialogueBoxRef = useRef<HTMLDivElement>(null);

//   const [setingNameAndEmail, setSetingNameAndEmail] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [validationErrors, setValidationErrors] = useState('');
//   const [chatInputDialogue, setChatInputDialogue] = useState('');
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [messages, setMessages] = useState([] as Message[]);
//   const [uploadActive, setUploadActive] = useState(false);

//   // <<< Event Handlers >>>
//   const handleCollapse = (): void => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const handleInputWebchatChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//   ): void => {
//     setChatInputDialogue(e.target.value);
//   };

//   const handleLocaleStorageName = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setName(e.target.value);
//   };
//   const handleLocaleStorageEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setEmail(e.target.value);
//   };

//   const validationSchema = yup.object().shape({
//     email: yup
//       .string()
//       .required('Debe introducir su Email')
//       .email('Debe introducir un Email válido'),
//     name: yup
//       .string()
//       .required('Debe introducir su Nombre')
//       .min(3, 'El Nombre debe tener 3 caracteres como mínimo'),
//   });

//   const handleSetNameAndEmailOnLocaleStorage = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     try {
//       await validationSchema.validate({ email, name });
//       localStorage.setItem('webchat_elipse_name', name);
//       localStorage.setItem('webchat_elipse_email', email);
//       setSetingNameAndEmail(true);
//       setValidationErrors('');
//     } catch (err) {
//       setValidationErrors(err.errors[0]);
//     }
//   };

//   // <<< useCallback functions >>>
//   const handleSendMessage = useCallback(async () => {
//     if (socket.connected) {
//       setChatInputDialogue('');
//       const bodyObject: Message = {
//         content: chatInputDialogue,
//         infoUser: `${name} - ${email}`,
//       };
//       try {
//         setSendingMessage(true);
//         const axiosConfig: AxiosRequestConfig = {
//           url: `${processEnv.restUrl}/webchat/sendMessageToAgent`,
//           method: 'post',
//           data: bodyObject,
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           params: {
//             chatId: localStorage.getItem('chatId') || '',
//           },
//         };
//         const response = await axios(axiosConfig);
//         if (response.data.success) {
//           if (response?.data?.result?._id) {
//             localStorage.setItem('chatId', response.data.result._id);
//             socket.emit(
//               'joinWebchatUser',
//               response.data.result.client.clientId,
//             );
//             setMessages(response.data.result.messages);
//           } else {
//             setMessages(response.data.result);
//           }
//         } else {
//           Swal.fire({
//             title:
//               'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
//             confirmButtonText: 'OK',
//             confirmButtonColor: processEnv.mainColor,
//             imageUrl: RobotAvatar,
//             imageWidth: 100,
//             imageHeight: 100,
//             imageAlt: 'Custom image',
//             customClass: {
//               popup: 'animated animate__fadeInDown',
//             },
//           });
//         }
//         setSendingMessage(false);
//       } catch (error) {
//         Swal.fire({
//           title:
//             'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
//           confirmButtonText: 'OK',
//           confirmButtonColor: processEnv.mainColor,
//           imageUrl: RobotAvatar,
//           imageWidth: 100,
//           imageHeight: 100,
//           imageAlt: 'Custom image',
//           customClass: {
//             popup: 'animated animate__fadeInDown',
//           },
//         });
//       }
//     } else {
//       Swal.fire({
//         title:
//           'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
//         confirmButtonText: 'OK',
//         confirmButtonColor: processEnv.mainColor,
//         imageUrl: RobotAvatar,
//         imageWidth: 100,
//         imageHeight: 100,
//         imageAlt: 'Custom image',
//         customClass: {
//           popup: 'animated animate__fadeInDown',
//         },
//       });
//     }
//   }, [chatInputDialogue, socket, name, email]);

//   const handleEnterToSendMessage = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//   ) => {
//     if (e.key === 'Enter') {
//       if (chatInputDialogue.trim() !== '') {
//         handleSendMessage();
//       }
//     }
//   };

//   const handleClcikToSendMessage = () => {
//     if (chatInputDialogue.trim() !== '') {
//       handleSendMessage();
//     }
//   };

//   const getMessages = useCallback(
//     async (idChat) => {
//       try {
//         const axiosConfig: AxiosRequestConfig = {
//           url: `${processEnv.restUrl}/webchat/getConversation/${idChat}`,
//           method: 'get',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         };
//         const response = await axios(axiosConfig);
//         if (response.data.success) {
//           setMessages(response.data.result);
//         } else {
//           Swal.fire({
//             title:
//               'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
//             confirmButtonText: 'OK',
//             confirmButtonColor: processEnv.mainColor,
//             imageUrl: RobotAvatar,
//             imageWidth: 100,
//             imageHeight: 100,
//             imageAlt: 'Custom image',
//             customClass: {
//               popup: 'animated animate__fadeInDown',
//             },
//           });
//         }
//       } catch (error) {
//         Swal.fire({
//           title:
//             'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
//           confirmButtonText: 'OK',
//           confirmButtonColor: processEnv.mainColor,
//           imageUrl: RobotAvatar,
//           imageWidth: 100,
//           imageHeight: 100,
//           imageAlt: 'Custom image',
//           customClass: {
//             popup: 'animated animate__fadeInDown',
//           },
//         });
//       }
//     },
//     [setMessages],
//   );

//   const scrollToBottom = useCallback(() => {
//     dialogueBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [dialogueBoxRef]);

//   const handleDownloadFile = async (file: string, chatId: string) => {
//     try {
//       const response = await axios({
//         url: `${processEnv.restUrl}/webchat/file/${chatId}/${file}`,
//         method: 'get',
//         responseType: 'blob',
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', file);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       Swal.fire({
//         title:
//           'Estamos experimentando inconvenientes técnicos para descargar el archivo.',
//         confirmButtonText: 'OK',
//         confirmButtonColor: processEnv.mainColor,
//         imageUrl: RobotAvatar,
//         imageWidth: 100,
//         imageHeight: 100,
//         imageAlt: 'Custom image',
//         customClass: {
//           popup: 'animated animate__fadeInDown',
//         },
//       });
//     }
//   };

//   useEffect(scrollToBottom, [scrollToBottom, messages]);

//   useEffect(() => {
//     if (localStorage.getItem('chatId')) {
//       const idChat = localStorage.getItem('chatId');
//       getMessages(idChat);
//     }
//   }, [getMessages]);

//   useEffect(() => {
//     const socketConnection = io(processEnv.socketUrl);
//     setSocket(socketConnection);
//   }, [setSocket]);

//   useEffect(() => {
//     socket?.on('connect', () => {
//       console.log('connected');
//     });
//     socket?.on('newMessageToWebchatUser', (arg: Message[]) => {
//       setMessages(arg);
//     });
//     socket?.on('finishConversationForWebchat', () => {
//       localStorage.removeItem('chatId');
//     });
//   }, [socket, setingNameAndEmail, messages]);

//   return (
//     <>
//       <div className={isCollapsed ? 'chat-container' : 'hidden'}>
//         <div className="assistant">
//           {/* <<<<<<<<<<< WAVES ANIMATION START >>>>>>>>>> */}
//           <div>
//             <svg
//               className="waves"
//               xmlns="http://www.w3.org/2000/svg"
//               xmlnsXlink="http://www.w3.org/1999/xlink"
//               viewBox="0 24 150 28"
//               preserveAspectRatio="none"
//               shapeRendering="auto">
//               <defs>
//                 <path
//                   id="gentle-wave"
//                   d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
//                 />
//               </defs>
//               <g className="parallax">
//                 <use
//                   xlinkHref="#gentle-wave"
//                   x="48"
//                   y="0"
//                   fill="rgba(255,255,255,0.7)"
//                 />
//                 <use
//                   xlinkHref="#gentle-wave"
//                   x="48"
//                   y="3"
//                   fill="rgba(255,255,255,0.5)"
//                 />
//                 <use
//                   xlinkHref="#gentle-wave"
//                   x="48"
//                   y="5"
//                   fill="rgba(255,255,255,0.3)"
//                 />
//                 <use xlinkHref="#gentle-wave" x="48" y="7" fill="#ffffff" />
//               </g>
//             </svg>
//           </div>
//           {/* <<<<<<<<<<< WAVES ANIMATION FINISH >>>>>>>>>> */}

//           <img className="avatar" src={RobotAvatar} alt="avatar" />
//           <div className="titles-container">
//             <h1 className="assistant-name">{processEnv.name}</h1>
//             <p className="assistant-title">{processEnv.description}</p>
//           </div>
//           <div className="header-button-conatiner">
//             <button
//               type="button"
//               className="colapse-button"
//               onClick={handleCollapse}>
//               <img className="down-image" src={CollapseButton} alt="send" />
//             </button>
//           </div>
//         </div>

//         {localStorage.getItem('webchat_elipse_name') &&
//           localStorage.getItem('webchat_elipse_email') && (
//             <>
//               <div className="chat-box">
//                 <div className="dialogues-box">
//                   <div>
//                     <div className="bot-dialogue">
//                       <div className="bot-image-container">
//                         <img className="bot-image" src={RobotAvatar} alt="" />
//                       </div>
//                       <div className="bot-text-container">
//                         <p className="bot-text">
//                           Hola {localStorage.getItem('webchat_elipse_name')}
//                           !. Mi nombre es {processEnv.name} y estoy para leer
//                           tus preguntas y resolver tus dudas. ¿En qué puedo
//                           ayudarte?
//                         </p>
//                       </div>
//                     </div>
//                     <div className="bot-time">
//                       {' '}
//                       {new Date().toLocaleTimeString('en-US', {
//                         hour: 'numeric',
//                         minute: 'numeric',
//                         hour12: true,
//                       })}
//                     </div>
//                   </div>
//                   {messages &&
//                     messages?.map((message) =>
//                       message.from === 'AGENT' ? (
//                         <div key={message._id}>
//                           <div className="bot-dialogue">
//                             <div className="bot-image-container">
//                               <img
//                                 className="bot-image"
//                                 src={RobotAvatar}
//                                 alt=""
//                               />
//                             </div>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleDownloadFile(
//                                   message.content.split('/')[3],
//                                   localStorage?.getItem('chatId'),
//                                 )
//                               }
//                               className={
//                                 message.contentType === 'ATTACHMENT'
//                                   ? 'bot-text-container clickable-bot'
//                                   : 'bot-text-container'
//                               }>
//                               <span className="bot-text">
//                                 {message.contentType === 'ATTACHMENT' &&
//                                   message.content.substring(
//                                     message.content.length - 3,
//                                     message.content.length,
//                                   ) !== 'pdf' && (
//                                     <img
//                                       className="bot-image-uploaded"
//                                       src={ImageIcon}
//                                       alt="img"
//                                     />
//                                   )}
//                                 {message.contentType === 'ATTACHMENT' &&
//                                   message.content.substring(
//                                     message.content.length - 3,
//                                     message.content.length,
//                                   ) === 'pdf' && (
//                                     <img
//                                       className="bot-image-uploaded"
//                                       src={PdfIcon}
//                                       alt="pdf"
//                                     />
//                                   )}
//                                 {message.contentType === 'ATTACHMENT' &&
//                                   message.content.substring(
//                                     76,
//                                     message.content.length,
//                                   )}
//                                 {message.contentType === 'TEXT' &&
//                                   message.content}
//                               </span>
//                             </button>
//                           </div>
//                           <div className="bot-time">
//                             {' '}
//                             {new Date(message.createdAt).toLocaleTimeString(
//                               'en-US',
//                               {
//                                 hour: 'numeric',
//                                 minute: 'numeric',
//                                 hour12: true,
//                               },
//                             )}
//                           </div>
//                         </div>
//                       ) : (
//                         <div key={message._id}>
//                           <div className="user-dialogue">
//                             <button
//                               type="button"
//                               className={
//                                 message.contentType === 'ATTACHMENT'
//                                   ? 'user-dialogue-container clickable-user'
//                                   : 'user-dialogue-container'
//                               }>
//                               {message.contentType === 'TEXT' &&
//                                 message.content}
//                               {message.contentType === 'ATTACHMENT' &&
//                                 message.content.substring(
//                                   76,
//                                   message.content.length,
//                                 )}
//                               {message.contentType === 'ATTACHMENT' &&
//                                 message.content.substring(
//                                   message.content.length - 3,
//                                   message.content.length,
//                                 ) !== 'pdf' && (
//                                   <img
//                                     className="bot-image-uploaded"
//                                     src={ImageIcon}
//                                     alt="img"
//                                   />
//                                 )}
//                               {message.contentType === 'ATTACHMENT' &&
//                                 message.content.substring(
//                                   message.content.length - 3,
//                                   message.content.length,
//                                 ) === 'pdf' && (
//                                   <img
//                                     className="bot-image-uploaded"
//                                     src={PdfIcon}
//                                     alt="pdf"
//                                   />
//                                 )}
//                             </button>
//                           </div>
//                           <div className="user-time">
//                             {new Date(message.createdAt).toLocaleTimeString(
//                               'en-US',
//                               {
//                                 hour: 'numeric',
//                                 minute: 'numeric',
//                                 hour12: true,
//                               },
//                             )}
//                           </div>
//                         </div>
//                       ),
//                     )}
//                   <div ref={dialogueBoxRef} />
//                 </div>
//               </div>
//               <div className="input-container">
//                 <button
//                   onClick={() => setUploadActive(!uploadActive)}
//                   type="button"
//                   className={
//                     uploadActive
//                       ? 'upload-button upload-active'
//                       : 'upload-button'
//                   }>
//                   <img className="file-icon" src={SendButton} alt="file" />
//                 </button>
//                 {uploadActive && (
//                   <UploadFiles
//                     fromId={messages[0]?.from}
//                     setUploadActive={setUploadActive}
//                   />
//                 )}
//                 <input
//                   disabled={sendingMessage}
//                   type="text"
//                   className="chat-input"
//                   placeholder={sendingMessage ? '' : 'Envía un mensaje...'}
//                   value={chatInputDialogue}
//                   onChange={handleInputWebchatChange}
//                   onKeyPress={(e: KeyboardEvent<HTMLInputElement>) =>
//                     handleEnterToSendMessage(e)
//                   }
//                 />
//                 {sendingMessage ? (
//                   <button
//                     type="button"
//                     className="send-button disabled-button"
//                     onClick={handleClcikToSendMessage}
//                     disabled>
//                     <SpinnerDotted
//                       size={30}
//                       thickness={120}
//                       speed={104}
//                       color="#f5f5f5"
//                     />
//                   </button>
//                 ) : (
//                   <button
//                     type="button"
//                     className="send-button"
//                     onClick={handleClcikToSendMessage}>
//                     <img className="send-image" src={SendButton} alt="send" />
//                   </button>
//                 )}
//               </div>
//             </>
//           )}

//         {(!localStorage.getItem('webchat_elipse_name') ||
//           !localStorage.getItem('webchat_elipse_email')) && (
//           <div className="chat-box-without-name-and-email">
//             <div className="without-header">
//               <div className="without-welcome">Bienvenido!</div>
//               <div className="without-information">
//                 Para poder iniciar la conversación, es necesario completar los
//                 siguientes campos:
//               </div>
//             </div>
//             <form className="without-body">
//               <input
//                 type="text"
//                 className={
//                   validationErrors.includes('Nombre')
//                     ? 'inp-control inp-control-error'
//                     : 'inp-control'
//                 }
//                 placeholder="Nombre"
//                 onChange={handleLocaleStorageName}
//               />
//               <input
//                 type="email"
//                 className={
//                   validationErrors.includes('Email')
//                     ? 'inp-control inp-control-error'
//                     : 'inp-control'
//                 }
//                 placeholder="Email"
//                 onChange={handleLocaleStorageEmail}
//               />
//               <p className="error-message">{validationErrors}</p>
//               <input
//                 type="submit"
//                 className="but-control"
//                 value="ENVIAR"
//                 onClick={(e) => handleSetNameAndEmailOnLocaleStorage(e)}
//               />
//             </form>
//           </div>
//         )}

//         <div className="footer">
//           <a
//             href="https://elipse.ai/elipse-chat/#preciosyplanes"
//             target="_blank"
//             className="footer-button"
//             rel="noreferrer">
//             Powered by Elipse
//           </a>
//         </div>
//       </div>
//       <button
//         type="button"
//         className={!isCollapsed ? 'button-trigger' : 'hidden'}
//         onClick={handleCollapse}>
//         <img className="trigger-avatar" src={RobotAvatar} alt="" />
//       </button>
//     </>
//   );
// };
