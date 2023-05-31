/* ***************************************************************************
 * Copyright © Biqmind Pte Ltd – 2021 - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * ************************************************************************ */
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';

import DWRRoutes from 'Routes';
import AppError from 'components/Error/AppError';
import ErrorBoundary from 'components/ErrorBoundary';
import caepeTheme from 'themes/DWSTheme';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

export const loggedInState = atom({
  key: 'loggedInState',
  default: false,
});

export const loggedUser = atom({
  key: 'loggedUser',
  default: "",
});

const Dashboard: React.FC = () => {

  return (
    <RecoilRoot>
      <ThemeProvider theme={caepeTheme}>
      <ErrorBoundary fallbackComponent={AppError}>
        <DWRRoutes />
      </ErrorBoundary>
    </ThemeProvider>
    </RecoilRoot>
  );
};

export default Dashboard;
