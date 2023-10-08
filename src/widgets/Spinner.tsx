import React from 'react';
import './Spinner.css';
import { Box } from '@mui/material';

type SpinnerProps = {
  text?: string;
};
const Spinner:React.FC<SpinnerProps> = ({text}) => {
  return (
    <Box component="span" className="spinner-container">
      <Box component="span" className="spinner"></Box>
      <Box component="span" className="spinner-text">{text}</Box>
    </Box>
  );
};

export default Spinner;