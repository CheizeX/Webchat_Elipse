import { formulario1, formulario2 } from './molecules/Forms/formsToUse';
import { ContentTypes, DERIVATIONS, MessageFrom, FormTypes } from './shared';

export const initialMessage = [
  {
    contentType: ContentTypes.TEXT,
    from: MessageFrom.BOT,
    // content: `¡Hola, estoy aquí para guiarte en los servicios de mediQo!
    //   Selecciona una de las siguientes opciones:`,
    content: `Hola. ¿En qué podemos ayudarte?`,
  },
];

export const suggestionsObjNew = [
  // ----------------------- <MEDICO> -----------------------
  {
    name: 'Soy médico',
    // icon: HorasMedPresSVG,
    question: '¿Ya formas parte de nuestra red médica?',
    // derivation: DERIVATIONS.AGENT,
    subItems: [
      {
        name: 'Si',
        // icon: CamaraSVG,
        subItems: [
          {
            name: 'Tengo dudas sobre la facturación',
            derivation: DERIVATIONS.FORM,
            derivationForm: formulario2,
          },
          {
            name: 'No funciona mi plataforma',
            derivation: DERIVATIONS.FORM,
            derivationForm: formulario2,
          },
          {
            name: 'Necesito hablar con HELP DESK',
            derivation: DERIVATIONS.FORM,
            derivationForm: formulario2,
          },
        ],
      },
      {
        name: 'No',
        // icon: CamaraSVG,
        options: [
          {
            text: `Haz click aquí para ir a Informes y registro`,
            icon: '',
            link: `https://medics.mediqo.com/join`,
          },
        ],
      },
    ],
  },

  // ----------------------- <PACIENTE> -----------------------

  {
    name: 'Soy paciente',
    // icon: MedicalSVG,
    question: '¿Qué necesitas?',
    subItems: [
      {
        name: 'Prueba COVID',
        // icon: SignpostSVG,
        subItems: [
          {
            name: 'PCR: $1350',
            derivation: DERIVATIONS.FORM,
            derivationForm: formulario2,
          },
          {
            name: 'Antígeno: $800',
            derivation: DERIVATIONS.FORM,
            derivationForm: formulario2,
          },
        ],
      },
      {
        name: 'Médico a domicilio',
        // icon: MicrobeSVG,
        // icon: HorasMedPresSVG,
        options: [
          {
            text: `Haz click aquí para solicitar un médico a domicilio`,
            icon: '',
            link: `https://mediqo.com/create_service?serviceType=0`,
          },
        ],
      },
      {
        name: 'Asesoría Virtual',
        options: [
          {
            text: `Haz click aquí para realizar una asesoría virtual`,
            icon: '',
            link: 'https://mediqo.com/create_service?serviceType=1',
          },
        ],
      },
      {
        name: 'Tuve problemas con mi servicio y necesito AYUDA',
        // icon: OtrasConsultasSVG,
        derivation: DERIVATIONS.FORM,
        derivationForm: formulario1, // FORMULARIOS DEFINIDOS EN EL ARCHIVO "formsToUse.ts"
      },
    ],
  },
];
