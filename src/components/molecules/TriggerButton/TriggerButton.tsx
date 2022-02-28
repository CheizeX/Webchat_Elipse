/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { webchatProps } from '../../WebChat/Webchat';

export const TriggerButton: FC<webchatProps> = function ({
  handleCollapse,
  isCollapsed,
  agentName,
  base64Avatar,
  svgBack,
}) {
  return (
    <button
      type="button"
      className={!isCollapsed ? 'button-trigger__ewc-class' : 'hidden'}
      onClick={handleCollapse}>
      <img
        className="trigger-avatar__ewc-class"
        src={
          agentName === ''
            ? `data:image/svg+xml;base64,${base64Avatar}`
            : svgBack.UserSVG
        }
        alt=""
      />
    </button>
  );
};
