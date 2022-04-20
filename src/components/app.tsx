import React from 'react';
import '../styles.scss';
import { WebChat } from './WebChat/Webchat';

const app = () => {
  return <WebChat />;
};

export default app;

// "scripts": {
//   "start": "webpack serve --port 3000 --mode development --open --hot --env companyId=61f713aee1822f4d387ae7f6 --env mainColor=#5603AD --env animation=yes --env secondaryColor=#32ACE2 --env name='Elipse Chat' --env description='Asistente Virtual' --env avatar=https://rest-ailalia.ngrok.io/rest/v1/api/webchat/avatar?avatar=Mascota_1 --env socketUrl=https://ws-ailalia.ngrok.io --env restUrl=https://rest-ailalia.ngrok.io/rest/v1/api",
//   "build": "webpack --mode production"
// }

// "scripts": {
//   "start": "webpack serve --port 3000 --mode development --open --hot --env companyId=61fd89f81dd5549a3fd446e1 --env mainColor=#5603AD --env animation=yes --env secondaryColor=#32ACE2 --env name='Elipse Chat' --env description='Asistente Virtual' --env avatar=https://api.elipsechat.com/rest/v1/api/webchat/avatar?avatar=Mascota_1 --env socketUrl=https://api.elipsechat.com --env restUrl=https://api.elipsechat.com/rest/v1/api",
//   "build": "webpack --mode production"
// },
