/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, KeyboardEvent } from 'react';
import { SpinnerDotted } from 'spinners-react';
import { webchatProps } from '../../WebChat/webchat.interface';
import { UploadFiles } from '../UploadFiles/UploadFiles';

export const InputsBox: FC<webchatProps> = function ({
  uploadActive,
  sendingMessage,
  chatInputDialogue,
  svgBack,
  outOfHourWarning,
  setUploadActive,
  setChatInputDialogue,
  handleSendMessage,
}) {
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
        onClick={() => !outOfHourWarning && setUploadActive(!uploadActive)}
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
          fromId={sessionStorage.getItem('webchat_elipse_email')}
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
