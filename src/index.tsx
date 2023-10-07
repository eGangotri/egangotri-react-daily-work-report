import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import {
  RecoilRoot,
  atom,
} from 'recoil';

import DWRRoutes from 'Routes';
import AppError from 'components/Error/AppError';
import ErrorBoundary from 'components/ErrorBoundary';
import caepeTheme from 'themes/DWSTheme';
import { BASIC_ROLE } from 'mirror/FrontEndBackendCommonConsts';
import './index.css';

export const loggedInState = atom({
  key: 'loggedInState',
  default: false,
});

export const loggedUser = atom({
  key: 'loggedUser',
  default: "",
});

export const loggedUserRole = atom({
  key: 'loggedUserRole',
  default: BASIC_ROLE,
});

export const loggedUserPassword = atom({
  key: 'loggedUserPassword',
  default: "",
});



const root = ReactDOM.createRoot(document.getElementById('root') as Element);

root.render(
  <BrowserRouter>
     <RecoilRoot>
      <ThemeProvider theme={caepeTheme}>
      <ErrorBoundary fallbackComponent={AppError}>
        <DWRRoutes />
      </ErrorBoundary>
    </ThemeProvider>
    </RecoilRoot>
  </BrowserRouter>,
);

