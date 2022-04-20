import { FormTypes } from '../../shared';

// OBJETOS DE FORMULARIOS :  el array en el órden que se quieran mostrar los campos
export const formulario1 = [
  {
    name: 'Expediente nº',
    type: FormTypes.NUMBER,
    placeholder: 'Ej: 22758',
  },
];

export const formulario2 = [
  {
    name: 'Teléfono',
    type: FormTypes.TEL,
    placeholder: 'Ej: +54 9 11-2233-4455',
  },
  {
    name: 'Domicilio',
    type: FormTypes.TEXT,
    placeholder: 'Ej: Monte Olivos 227',
  },
  {
    name: 'Número de pruebas',
    type: FormTypes.NUMBER,
    placeholder: 'Ej: 3',
  },
];
