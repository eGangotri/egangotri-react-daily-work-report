import "./DailyReport.css";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Stack,
  Grid,
  FormControlLabel
} from "@mui/material";
import _ from "lodash";
import React, { ReactNode, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { GoFileMedia } from "react-icons/go";
import HelperService from "service/HelperService";
import { DecorateWorkReport, emptyPdfStats } from "utils/AllScanReportStats";
import { scanCenters, panelOneCSS } from "service/CentersService";
import SendReportDialog from "pages/DailyReport/SendDailyReportToServerDialog";
import LoginPanel from "pages/LoginPanel";
import {
  useRecoilState,
} from 'recoil';
import TextField from '@mui/material/TextField';

import { loggedInState, loggedUser, loggedUserRole, loggedUserPassword } from "../../index";
import Spinner from "widgets/Spinner";
import { FormProvider, useForm } from 'react-hook-form';
import { DailyWorkReportType } from "types/dailyWorkReportTypes";
import Typography from "@mui/material/Typography";
import { ScanWorkReportType } from "mirror/scanWorkReportType";
import { getLibrariesInCenter } from "service/CentersService";

const DailyReport = () => {

  const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
  const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
  const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);
  const [_loggedUserPassword, setLoggedUserPassword] = useRecoilState(loggedUserPassword);

  const [pdfData, setPdfData] = useState<ScanWorkReportType>(emptyPdfStats);
  const [snackBarMsg, setSnackBarMsg] = useState<[string, ReactNode]>(["", (<></>)]);
  const [disabledState, setDisabledState] = useState<boolean>(false);
  const [workFromHome, setWorkFromHome] = useState<boolean>(false);

  const [center, setCenter] = React.useState<string>(scanCenters[0]);
  const [_notes, setNotes] = React.useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);


  const dataHoldingElement = useRef();
  const copyButton = useRef();
  const clearButton = useRef();

  const [libraries, setLibraries] = React.useState<string[]>(
    getLibrariesInCenter(center)
  );
  const [library, setLibrary] = React.useState<string>(libraries[0]);


  const clearResults = () => {
    setPdfData(emptyPdfStats);
    setDisabledState(true);
    setSnackBarMsg(["", ""]);
    setNotes("")
  };

  const notesOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setNotes(val);
    const updatedPdfData = {
      ...pdfData,
      notes: val,
    }
    setPdfData(updatedPdfData);
  }

  const handleCenterChange = (event: SelectChangeEvent) => {
    const val = event.target.value;
    console.log(`val ${val}`);
    setCenter(val);
    const _libraries = getLibrariesInCenter(val);
    setLibrary(_libraries[0]);
    setLibraries(_libraries);
    const updatedPdfData = {
      ...pdfData,
      lib: _libraries[0],
      center: val,
    }
    setPdfData(updatedPdfData);
  };

  const handleLibChange = (event: SelectChangeEvent) => {
    const val = event.target.value;
    console.log(`val ${val}`);
    setLibrary(val);
    const updatedPdfData = {
      ...pdfData,
      library: val,
    }
    setPdfData(updatedPdfData);
  };

  const handleWorkFromHome = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _workFromHome = event.target.checked;
    console.log(`val ${_workFromHome}`);
    setWorkFromHome(_workFromHome);
    const updatedPdfData = {
      ...pdfData,
      workFromHome: _workFromHome,
    }
    setPdfData(updatedPdfData);

  };

  const uploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      try {
        setIsLoading(true)
        const data = await HelperService.processFiles(
          Array.from(files!),
          _loggedUser,
          center,
          library,
          _notes,
          workFromHome
        );
        setPdfData(data);
        setIsLoading(false);
      }
      catch (e: any) {
        setIsLoading(false);
      }
    }
  };

  const methods = useForm<DailyWorkReportType>();
  const { handleSubmit } = methods;
  const onFormSubmit = async (formData: DailyWorkReportType) => {
    console.log(`formData ${JSON.stringify(formData)}`);
  };

  return (
    <Stack spacing={2}>
      {isLoading && <Spinner />}
      <>
        <LoginPanel />
      </>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Stack spacing={2} direction="column">
            <Grid container spacing={{ xs: 1, md: 4 }} columns={{ xs: 2, sm: 6, md: 12 }} direction="row">
              <Grid item xs={2} sm={3} md={3}>
                <Box sx={panelOneCSS}>
                  <InputLabel id="l1">Center</InputLabel>
                </Box>
                <Box sx={panelOneCSS}>
                  <Select
                    labelId="l1"
                    id="demo-simple-select-standard"
                    value={center}
                    onChange={handleCenterChange}
                    sx={{ minWidth: '200px' }}
                    disabled={!_isLoggedIn}
                  >
                    {scanCenters.map((option: string) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
              <Grid item xs={2} sm={3} md={3}>
                <Box sx={panelOneCSS}>
                  <InputLabel id="l2">Library</InputLabel>
                </Box>
                <Box sx={panelOneCSS}>
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
                      <MenuItem
                        key={option}
                        value={option}
                        selected={option === library || index === 1}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item sx={{ paddingLeft: 0, paddingTop: 0 }}>
                <FormControlLabel sx={{ marginLeft: 0 }}
                  control={<Checkbox
                    checked={workFromHome}
                    onChange={handleWorkFromHome} />}
                  label="Work From Home"
                  labelPlacement="start"
                />
              </Grid>
            </Grid>
            <Stack spacing={5} direction="row">
              <Typography>Any Optional Notes</Typography>
              <TextField
                id="_notes"
                type="text"
                onChange={notesOnChange}
                sx={{ width: "400px" }}
                value={_notes}
                multiline={true}
                maxRows={3} />
            </Stack>
            <label htmlFor="upload-pdf">
              <input
                style={{ display: "none" }}
                id="upload-pdf"
                name="upload-pdf"
                type="file"
                multiple
                accept=".pdf"
                disabled={!_isLoggedIn || center === scanCenters[0]}
                onChange={uploadPdf}
              />
              <Button
                color="primary"
                variant="contained"
                component="span"
                disabled={!_isLoggedIn || center === scanCenters[0]}
                endIcon={<GoFileMedia style={{ color: "primary" }} />}
              >
                Choose PDFs
              </Button>
            </label>
            <Stack spacing={2} direction="row">
              <SendReportDialog pdfData={pdfData} setPdfData={setPdfData} snackBarMsg={snackBarMsg} setSnackBarMsg={setSnackBarMsg} password={_loggedUserPassword} />
              <Button
                variant="contained"
                endIcon={<FaRegTrashAlt style={{ color: "primary" }} />}
                onClick={() => clearResults()}
              //disabled={AllPdfStats.isEmpty(pdfData)}
              >
                Clear
              </Button>
              <Box>
                <Snackbar open={snackBarMsg[0] !== ""} autoHideDuration={6000}>
                  <Alert severity={snackBarMsg[0] === "success" ? "success" : (snackBarMsg[0] === "warning" ? "warning" : "error")} sx={{ width: '100%' }}>
                    {snackBarMsg[1]}
                  </Alert>
                </Snackbar>
              </Box>
            </Stack>
            <Box ref={dataHoldingElement}><DecorateWorkReport all={pdfData} /></Box>
            <Box sx={{ paddingTop: "30px" }}></Box>
          </Stack>
        </form>
      </FormProvider>
    </Stack>

  );
};

export default DailyReport;
