import React, { Dispatch, FC, Fragment, SetStateAction } from 'react';
import { FormProps } from '../../shared';
import { webchatProps } from '../../WebChat/webchat.interface';

interface Props {
  formFields: FormProps[];
  setFormFields: Dispatch<SetStateAction<FormProps[]>>;
}

export const Forms: FC<webchatProps & Props> = function ({
  formFields,
  setFormFields,
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields(
      formFields.map((field) =>
        field.name === name ? { ...field, value } : field,
      ),
    );
  };

  return (
    <>
      {formFields.map(({ name, type, placeholder, value }) => (
        <Fragment key={name}>
          <div
            className={
              value === ''
                ? 'form-field-name-bot-error__ewc-class'
                : 'form-field-name-bot__ewc-class'
            }>
            {name}
          </div>
          <input
            className={
              value === ''
                ? 'form-field-bot-error__ewc-class'
                : 'form-field-bot__ewc-class'
            }
            type={type}
            name={name}
            min={0}
            placeholder={placeholder}
            autoComplete="off"
            onChange={handleChange}
          />
        </Fragment>
      ))}
    </>
  );
};
