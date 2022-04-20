/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import Warning from '../../../../assets/warning.svg';
import { webchatProps } from '../../../WebChat/webchat.interface';

export const FinishedConversation: FC<webchatProps> = function ({
  setConversationFinished,
  handleCollapse,
}) {
  const handleClick = () => {
    handleCollapse();
    setConversationFinished(false);
  };
  return (
    <div className="conversation-finished__ewc-class">
      <div>
        <img src={Warning} alt="finished" />
      </div>
      <h1>CONVERSACION FINALIZADA</h1>
      <span>
        Nuestro agente ha dado por finalizada la conversación y esperamos que
        haya logrado resolver sus inquietudes.
      </span>
      <span>Muchas gracias.</span>
      <button
        className="button-close-conversation-finished__ewc-class"
        type="button"
        onClick={handleClick}>
        OK
      </button>
    </div>
  );
};
