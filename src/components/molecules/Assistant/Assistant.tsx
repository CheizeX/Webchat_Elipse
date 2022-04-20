import React, { FC } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { MdOutlineSupportAgent } from 'react-icons/md';
import { webchatProps } from '../../WebChat/webchat.interface';
import { AnimationSvg } from '../AnimationSvg/Animation';

export const Assistant: FC<webchatProps> = function ({
  handleCollapse,
  agentName,
  base64Avatar,
}) {
  return (
    <div className="assistant__ewc-class">
      <AnimationSvg />
      {agentName === '' ? (
        <img
          src={`data:image/svg+xml;base64,${base64Avatar}`}
          className="avatar__ewc-class"
          alt="avatar"
        />
      ) : (
        <MdOutlineSupportAgent className="assistant-image__ewc-class" />
      )}
      <div className="titles-container__ewc-class">
        {agentName === '' ? (
          <>
            <h1 className="assistant-name__ewc-class">{processEnv.name}</h1>
            <p className="assistant-title__ewc-class">
              {processEnv.description}
            </p>
          </>
        ) : (
          <>
            <h1 className="assistant-name__ewc-class">{agentName}</h1>
            <p className="assistant-title__ewc-class">Agente</p>
          </>
        )}
      </div>
      <div className="header-button-conatiner__ewc-class">
        <button
          type="button"
          className="colapse-button__ewc-class"
          onClick={handleCollapse}>
          <AiFillCaretDown color="white" size="20px" />
        </button>
      </div>
    </div>
  );
};
