import React from 'react';
import ReactDOM from 'react-dom';

import './styles/main.scss';
import { Root } from './root.component';

function startApp() {
  ReactDOM.render(<Root />, document.querySelector('#app'));
  window.removeEventListener('DOMContentLoaded', startApp);
}

window.addEventListener('DOMContentLoaded', startApp);