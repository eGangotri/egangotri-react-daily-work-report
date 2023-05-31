import Dashboard from 'pages/Dashboard';
import './index.css';

import DailyReport from 'pages/DailyReport';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);

root.render(
  <BrowserRouter>
    <Dashboard />
  </BrowserRouter>,
);

