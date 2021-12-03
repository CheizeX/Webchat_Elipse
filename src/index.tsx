import * as React from 'react';
import { render } from 'react-dom';
import Favicon from 'react-favicon';
import App from './components/app';
import RobotAvatar from './assets/robot.svg';

render(
  <>
    <Favicon url={RobotAvatar} />
    <App />
  </>,
  document.getElementById('root'),
);
