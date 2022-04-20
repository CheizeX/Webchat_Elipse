/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { MdOutlineSupportAgent } from 'react-icons/md';
import { webchatProps } from '../../WebChat/webchat.interface';

export const TriggerButton: FC<webchatProps> = function ({
  handleCollapse,
  isCollapsed,
  agentName,
  base64Avatar,
}) {
  return (
    <button
      type="button"
      className={!isCollapsed ? 'button-trigger__ewc-class' : 'hidden'}
      onClick={handleCollapse}>
      {agentName === '' ? (
        <img
          src={`data:image/svg+xml;base64,${base64Avatar}`}
          className="avatar__ewc-class"
          alt="avatar"
        />
      ) : (
        <MdOutlineSupportAgent className="assistant-trigger__ewc-class" />
      )}
    </button>
  );
};
