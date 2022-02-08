/* eslint-disable react/jsx-props-no-spreading */
import axios from 'axios';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { SpinnerCircularFixed } from 'spinners-react';
import { FaFileDownload, FaWindowClose } from 'react-icons/fa';
import { CgMaximizeAlt } from 'react-icons/cg';
import RobotAvatar from '../../../assets/robot.svg';
import UserSVG from '../../../assets/user.svg';
import { webchatProps } from '../../WebChat/Webchat';

export const ChatBox: FC<webchatProps> = function ({ messages, agentName }) {
  const dialogueBoxRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [maximizedFile, setMaximizedFile] = useState('');

  const scrollToBottom = useCallback(() => {
    dialogueBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueBoxRef]);

  const handleDownloadFile = async (file: string, chatId: string) => {
    try {
      setLoading(true);
      const response = await axios({
        url: `${processEnv.restUrl}/webchat/file/${chatId}/${file}`,
        method: 'get',
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      Swal.fire({
        title:
          'Estamos experimentando inconvenientes técnicos para descargar el archivo.',
        confirmButtonText: 'OK',
        confirmButtonColor: processEnv.mainColor,
        customClass: {
          popup: 'animated animate__fadeInDown',
        },
      });
    }
    setLoading(false);
  };

  useEffect(scrollToBottom, [scrollToBottom, messages]);

  return (
    <div className="chat-box__ewc-class">
      <div className="dialogues-box__ewc-class">
        <div>
          <div className="bot-dialogue__ewc-class">
            <div className="bot-image-container__ewc-class">
              <img
                className="bot-image__ewc-class"
                src={agentName === '' ? RobotAvatar : UserSVG}
                alt=""
              />
            </div>
            <div className="bot-text-container__ewc-class">
              <p className="bot-text__ewc-class">
                Hola {sessionStorage.getItem('webchat_elipse_name')}. Estamos
                para leer tus preguntas y resolver tus dudas. Realiza tu
                consulta y cuando un agente se encuentre disponible te
                responderá a la brevedad. Muchas gracias.
              </p>
            </div>
          </div>
          <div className="bot-time__ewc-class">
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
              <div key={message._id}>
                <div className="bot-dialogue__ewc-class">
                  <div className="bot-image-container__ewc-class">
                    <img
                      className="bot-image__ewc-class"
                      src={agentName === '' ? RobotAvatar : UserSVG}
                      alt=""
                    />
                  </div>
                  <div
                    className={
                      message.contentType === 'ATTACHMENT'
                        ? 'bot-text-container__ewc-class clickable-bot__ewc-class'
                        : 'bot-text-container__ewc-class'
                    }>
                    <span className="bot-text__ewc-class">
                      {message.contentType === 'ATTACHMENT' &&
                        message.content.substring(
                          message.content.length - 3,
                          message.content.length,
                        ) !== 'pdf' && (
                          <img
                            className="bot-image-uploaded__ewc-class"
                            src={`${
                              processEnv.restUrl
                            }/webchat/file/${sessionStorage.getItem(
                              'chatId',
                            )}/${message.content.substring(
                              39,
                              message.content.length,
                            )}`}
                            alt="img"
                          />
                        )}

                      {message.contentType === 'ATTACHMENT' &&
                        message.content.substring(
                          message.content.length - 3,
                          message.content.length,
                        ) === 'pdf' && (
                          <iframe
                            className="bot-image-uploaded__ewc-class"
                            src={`${
                              processEnv.restUrl
                            }/webchat/file/${sessionStorage.getItem(
                              'chatId',
                            )}/${message.content.substring(
                              39,
                              message.content.length,
                            )}`}
                            width="100px"
                            height="100px"
                            style={{
                              overflow: 'hidden',
                            }}
                            title="pdf"
                          />
                        )}

                      {message.contentType === 'ATTACHMENT' &&
                        message.content.substring(
                          message.content.length - 3,
                          message.content.length,
                        ) && (
                          <div className="maximize-and-download-container__ewc-class">
                            <button
                              type="button"
                              onClick={() => setMaximizedFile(message._id)}>
                              <CgMaximizeAlt className="bot-file-maximize__ewc-class" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDownloadFile(
                                  message.content.split('/')[3],
                                  sessionStorage?.getItem('chatId'),
                                )
                              }>
                              {loading ? (
                                <SpinnerCircularFixed
                                  size={20}
                                  thickness={250}
                                  color="#ffff"
                                />
                              ) : (
                                <FaFileDownload className="bot-file-download__ewc-class" />
                              )}
                            </button>
                          </div>
                        )}

                      {message.contentType === 'TEXT' && message.content}
                    </span>

                    {maximizedFile === message._id && (
                      <article className="maximized-file-modal__ewc-class">
                        <button
                          type="button"
                          className="minimize-image-button__ewc-class"
                          onClick={() => setMaximizedFile('')}>
                          <FaWindowClose />
                        </button>

                        {message.contentType === 'ATTACHMENT' &&
                        message.content.substring(
                          message.content.length - 3,
                          message.content.length,
                        ) === 'pdf' ? (
                          <iframe
                            className="bot-image-uploaded__ewc-class"
                            src={`${
                              processEnv.restUrl
                            }/webchat/file/${sessionStorage.getItem(
                              'chatId',
                            )}/${message.content.substring(
                              39,
                              message.content.length,
                            )}`}
                            width="85%"
                            height="100%"
                            title={`${
                              processEnv.restUrl
                            }/webchat/file/${sessionStorage.getItem(
                              'chatId',
                            )}/${message.content.substring(
                              39,
                              message.content.length,
                            )}`}
                          />
                        ) : (
                          <img
                            className="bot-image-maximized__ewc-class"
                            src={`${
                              processEnv.restUrl
                            }/webchat/file/${sessionStorage.getItem(
                              'chatId',
                            )}/${message.content.substring(
                              39,
                              message.content.length,
                            )}`}
                            alt="maximized file"
                          />
                        )}
                      </article>
                    )}
                  </div>
                </div>
                <div className="bot-time__ewc-class">
                  {' '}
                  {new Date(message.createdAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </div>
              </div>
            ) : (
              <div key={message._id}>
                <div className="user-dialogue__ewc-class">
                  {maximizedFile === message._id && (
                    <article className="maximized-file-modal__ewc-class">
                      <button
                        type="button"
                        className="minimize-image-button__ewc-class"
                        onClick={() => setMaximizedFile('')}>
                        <FaWindowClose />
                      </button>
                      {message.contentType === 'ATTACHMENT' &&
                      message.content.substring(
                        message.content.length - 3,
                        message.content.length,
                      ) === 'pdf' ? (
                        <iframe
                          className="bot-image-uploaded__ewc-class"
                          src={`${
                            processEnv.restUrl
                          }/webchat/file/${sessionStorage.getItem(
                            'chatId',
                          )}/${message.content.substring(
                            39,
                            message.content.length,
                          )}`}
                          width="85%"
                          height="100%"
                          title={`${
                            processEnv.restUrl
                          }/webchat/file/${sessionStorage.getItem(
                            'chatId',
                          )}/${message.content.substring(
                            39,
                            message.content.length,
                          )}`}
                        />
                      ) : (
                        <img
                          className="bot-image-maximized__ewc-class"
                          src={`${
                            processEnv.restUrl
                          }/webchat/file/${sessionStorage.getItem(
                            'chatId',
                          )}/${message.content.substring(
                            39,
                            message.content.length,
                          )}`}
                          alt="maximized file"
                        />
                      )}
                    </article>
                  )}
                  <div
                    className={
                      message.contentType === 'ATTACHMENT'
                        ? 'user-dialogue-container__ewc-class clickable-user__ewc-class'
                        : 'user-dialogue-container__ewc-class'
                    }>
                    {message.contentType === 'TEXT' && message.content}

                    {message.contentType === 'ATTACHMENT' &&
                      message.content.substring(
                        message.content.length - 3,
                        message.content.length,
                      ) !== 'pdf' && (
                        <>
                          <img
                            className="user-image-uploaded__ewc-class"
                            src={`${
                              processEnv.restUrl
                            }/webchat/file/${sessionStorage.getItem(
                              'chatId',
                            )}/${message.content.substring(
                              39,
                              message.content.length,
                            )}`}
                            alt="img"
                          />
                          <div className="maximize-and-download-container__ewc-class user-maximize-and-download-container__ewc-class">
                            <button
                              type="button"
                              onClick={() => setMaximizedFile(message._id)}>
                              <CgMaximizeAlt className="bot-file-maximize__ewc-class" />
                            </button>
                          </div>
                        </>
                      )}

                    {message.contentType === 'ATTACHMENT' &&
                      message.content.substring(
                        message.content.length - 3,
                        message.content.length,
                      ) === 'pdf' && (
                        <>
                          <iframe
                            className="bot-image-uploaded__ewc-class"
                            src={`${
                              processEnv.restUrl
                            }/webchat/file/${sessionStorage.getItem(
                              'chatId',
                            )}/${message.content.substring(
                              39,
                              message.content.length,
                            )}`}
                            width="100px"
                            height="100px"
                            style={{
                              overflow: 'hidden',
                            }}
                            title="pdf"
                          />
                          <div className="maximize-and-download-container__ewc-class user-maximize-and-download-container__ewc-class">
                            <button
                              type="button"
                              onClick={() => setMaximizedFile(message._id)}>
                              <CgMaximizeAlt className="bot-file-maximize__ewc-class" />
                            </button>
                          </div>
                        </>
                      )}
                  </div>
                </div>
                <div className="user-time__ewc-class">
                  {new Date(message.createdAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </div>
              </div>
            ),
          )}
        <div ref={dialogueBoxRef} />
      </div>
    </div>
  );
};
