import React from 'react';
import {
  Grid,
  Box,
  InputLabel,
  Select,
  MenuItem,
   SelectChangeEvent,
} from '@mui/material';

interface CenterLibrarySelectorProps {
  center: string;
  library: string;
  libraries: string[];
  SCAN_CENTERS: string[];
  panelOneCSS: string;
  _isLoggedIn: boolean;
  handleCenterChange: (event: SelectChangeEvent) => void;
  handleLibChange: (event: SelectChangeEvent) => void;
}

const CenterLibrarySelector: React.FC<CenterLibrarySelectorProps> = ({
  center,
  library,
  libraries,
  SCAN_CENTERS,
  panelOneCSS,
  _isLoggedIn,
  handleCenterChange,
  handleLibChange,
}) => {
  return (
    <Grid container spacing={{ xs: 1, md: 4 }} columns={{ xs: 2, sm: 6, md: 12 }} direction="row">
      <Grid item xs={2} sm={3} md={3}>
        <Box className={panelOneCSS}>
          <InputLabel id="l1">Center</InputLabel>
        </Box>
        <Box className={panelOneCSS}>
          <Select
            labelId="l1"
            id="demo-simple-select-standard"
            value={center}
            onChange={handleCenterChange}
            sx={{ minWidth: '200px' }}
            disabled={!_isLoggedIn}
          >
            {SCAN_CENTERS.map((option: string) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Grid>
      <Grid item xs={2} sm={3} md={3}>
        <Box className={panelOneCSS}>
          <InputLabel id="l2">Library</InputLabel>
        </Box>
        <Box className={panelOneCSS}>
          <Select
            labelId="l2"
            id="demo-simple-select-filled"
            value={library}
            onChange={handleLibChange}
            label="Library"
            sx={{ minWidth: '200px' }}
            disabled={!_isLoggedIn}
          >
            {(libraries || []).map((option: string, index: number) => (
              <MenuItem key={option} value={option} selected={option === library || index === 1}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CenterLibrarySelector;