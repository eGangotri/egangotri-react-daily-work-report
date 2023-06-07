import React from 'react';
import Dashboard from 'pages/Dashboard';
import './index.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);

root.render(
  <BrowserRouter>
    <Dashboard />
  </BrowserRouter>,
);

