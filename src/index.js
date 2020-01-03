import React from 'react';
import { render } from 'react-dom';
import App from './router.js';

document.body.classList.remove('loading');
render(<App />, document.getElementById('root'));
