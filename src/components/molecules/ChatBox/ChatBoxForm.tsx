import React, { FC, useCallback, useState } from 'react';
import * as yup from 'yup';
import { webchatProps } from '../../WebChat/Webchat';

export const ChatBoxForm: FC<webchatProps> = function ({
  name,
  outOfHour,
  email,
  setSetingNameAndEmail,
  // validateBusinessTime,
  setOutOfHourWarning,
  setName,
  setEmail,
}) {
  const [validationErrors, setValidationErrors] = useState('');

  // <<< VALIDACIÓN DE INPUTS >>>
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required('Debe introducir su Email')
      .email('Debe introducir un Email válido'),
    name: yup
      .string()
      .required('Debe introducir su Nombre')
      .min(3, 'El Nombre debe tener 3 caracteres como mínimo'),
  });

  const handleSetNameAndEmailOnStorage = useCallback(async () => {
    try {
      await validationSchema.validate({
        email,
        name,
      });
      sessionStorage.setItem('webchat_elipse_name', name);
      sessionStorage.setItem('webchat_elipse_email', email);
      setSetingNameAndEmail(true);
      setValidationErrors('');
    } catch (err) {
      setValidationErrors(err.errors[0]);
    }
  }, [email, name, validationSchema, setSetingNameAndEmail]);

  const handleSendButton = () => {
    // validateBusinessTime();
    if (outOfHour) {
      setOutOfHourWarning(true);
      return;
    }
    handleSetNameAndEmailOnStorage();
  };

  const handleLocaleStorageName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleLocaleStorageEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="chat-box-without-name-and-RUT__ewc-class">
      <div className="without-header__ewc-class">
        <div className="without-welcome__ewc-class">Bienvenido!</div>
        <div className="without-information__ewc-class">
          Completa los siguientes campos para poder iniciar la comunicación con
          uno de nuestros agentes.
        </div>
      </div>
      <form className="without-body__ewc-class">
        <input
          type="text"
          className={
            validationErrors.includes('Nombre')
              ? 'inp-control__ewc-class inp-control-error__ewc-class'
              : 'inp-control__ewc-class'
          }
          placeholder="Nombre Completo"
          onChange={handleLocaleStorageName}
        />
        <input
          type="email"
          className={
            validationErrors.includes('Email')
              ? 'inp-control__ewc-class  inp-control-error__ewc-class '
              : 'inp-control__ewc-class '
          }
          placeholder="Email"
          onChange={handleLocaleStorageEmail}
        />
        <p className="error-message__ewc-class">{validationErrors}</p>
        <input
          type="button"
          className="but-control__ewc-class"
          value="ENVIAR"
          onClick={handleSendButton}
        />
      </form>
    </div>
  );
};
