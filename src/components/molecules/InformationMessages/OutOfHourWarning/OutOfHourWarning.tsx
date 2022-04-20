/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import Warning from '../../../../assets/warning.svg';
import { webchatProps } from '../../../WebChat/webchat.interface';

export const OutOfHourWarningComponent: FC<webchatProps> = function ({
  setOutOfHourWarning,
}) {
  return (
    <div className="out-of-hour__ewc-class">
      <div>
        <img src={Warning} alt="out of hour" />
      </div>
      <h1>HORARIO DE ATENCION</h1>
      <span>De Lunes a Jueves de 8:30hs a 18:00hs.</span>
      <span>Viernes de 8:30hs a 16:00hs.</span>
      <button
        className="button-close-out-of-our__ewc-class"
        type="button"
        onClick={() => setOutOfHourWarning(false)}>
        OK
      </button>
    </div>
  );
};
