import React, { FC } from 'react';
import RobotAvatar from '../../../assets/robot.svg';
import UserSVG from '../../../assets/user.svg';
import CollapseButton from '../../../assets/chevron-square-down.svg';
import { webchatProps } from '../../WebChat/Webchat';
import { AnimationSvg } from '../AnimationSvg/Animation';

export const Assistant: FC<webchatProps> = function ({
  handleCollapse,
  agentName,
}) {
  return (
    <div className="assistant__ewc-class">
      <AnimationSvg />
      <img
        className="avatar__ewc-class"
        src={agentName === '' ? RobotAvatar : UserSVG}
        alt="avatar"
      />
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
          <img
            className="down-image__ewc-class"
            src={CollapseButton}
            alt="send"
          />
        </button>
      </div>
    </div>
  );
};
