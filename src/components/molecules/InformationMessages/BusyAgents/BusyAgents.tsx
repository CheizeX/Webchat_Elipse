/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import Warning from '../../../../assets/warning.svg';
import { webchatProps } from '../../../WebChat/Webchat';

export const BusyAgents: FC<webchatProps> = function ({ setBusyAgents }) {
  return (
    <div className="busy-agents__ewc-class">
      <div>
        <img src={Warning} alt="busy agents" />
      </div>
      <h1>AGENTES OCUPADOS</h1>
      <span>
        Todos nuestros agentes se encuentran ocupados en este momento. Por favor
        aguarde un instante.
      </span>
      <span>Muchas gracias.</span>
      <button
        className="button-close-busy-agents__ewc-class"
        type="button"
        onClick={() => setBusyAgents(false)}>
        OK
      </button>
    </div>
  );
};
