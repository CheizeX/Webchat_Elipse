/* eslint-disable react/jsx-props-no-spreading */
import axios, { AxiosRequestConfig } from 'axios';
import React, { FC, KeyboardEvent, useCallback } from 'react';
import Swal from 'sweetalert2';
import { SpinnerDotted } from 'spinners-react';
import { webchatProps } from '../../WebChat/Webchat';
import { UploadFiles } from '../UploadFiles/UploadFiles';
import { Message } from '../../shared';

export const InputsBox: FC<webchatProps> = function ({
  messages,
  outOfHour,
  uploadActive,
  sendingMessage,
  chatInputDialogue,
  setOutOfHourWarning,
  setUploadActive,
  setChatInputDialogue,
  setSendingMessage,
  setMessages,
  setBusyAgents,
  // validateBusinessTime,
  socket,
  svgBack,
}) {
  const handleSendMessage = useCallback(async () => {
    // validateBusinessTime();
    if (outOfHour) {
      return;
    }
    if (socket.connected) {
      setChatInputDialogue('');
      const bodyObject: Message = {
        content: chatInputDialogue,
        infoUser: `${sessionStorage?.getItem(
          'webchat_elipse_name',
        )} - ${sessionStorage?.getItem('webchat_elipse_email')}`,
      };
      try {
        setSendingMessage(true);
        const axiosConfig: AxiosRequestConfig = {
          url: `${processEnv.restUrl}/webchat/sendMessageToAgent`,
          method: 'post',
          data: bodyObject,
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            chatId: sessionStorage.getItem('chatId') || '',
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
        } else if (response?.data.errorMessage === 'Agents not available') {
          if (response?.data?.chat?.result?._id) {
            sessionStorage.setItem('chatId', response.data.chat.result._id);
            socket.emit(
              'joinWebchatUser',
              response.data.chat.result.client.clientId,
            );
            setMessages(response.data.chat.result.messages);
            setBusyAgents(true);
          } else {
            setMessages(response.data.chat.result);
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
  }, [
    chatInputDialogue,
    socket,
    // validateBusinessTime,
    outOfHour,
    setMessages,
    setChatInputDialogue,
    setSendingMessage,
    setBusyAgents,
  ]);

  const handleEnterToSendMessage = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      if (chatInputDialogue.trim() !== '') {
        handleSendMessage();
      }
    }
  };

  const handleClcikToSendMessage = () => {
    if (chatInputDialogue.trim() !== '') {
      handleSendMessage();
    }
  };

  const handleInputWebchatChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setChatInputDialogue(e.target.value);
  };

  return (
    <div className="inputs-container__ewc-class">
      <button
        onClick={() =>
          outOfHour ? setOutOfHourWarning(true) : setUploadActive(!uploadActive)
        }
        type="button"
        className={
          uploadActive
            ? 'upload-button__ewc-class upload-active__ewc-class'
            : 'upload-button__ewc-class'
        }>
        <img
          className="file-icon__ewc-class"
          src={svgBack.SendButton}
          alt="file"
        />
      </button>
      {uploadActive && (
        <UploadFiles
          fromId={messages[0]?.from}
          setUploadActive={setUploadActive}
          svgBack={svgBack}
        />
      )}
      <input
        disabled={sendingMessage}
        type="text"
        className="chat-input__ewc-class"
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
          className="send-button__ewc-class disabled-button__ewc-class"
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
          className="send-button__ewc-class"
          onClick={handleClcikToSendMessage}>
          <img
            className="send-image__ewc-class"
            src={svgBack.SendButton}
            alt="send"
          />
        </button>
      )}
    </div>
  );
};
