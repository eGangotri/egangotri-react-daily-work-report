import "./DailyReport.css";

import {
  Alert,
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Stack,
} from "@mui/material";
import _ from "lodash";
import React, { useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { GoFileMedia } from "react-icons/go";
import HelperService from "service/HelperService";
import AllPdfStats from "vo/AllPdfStats";
import { libraryMenuOptions, centers, panelOneCSS } from "pages/constants";
import SendReportDialog, { SUCCESS_MSG } from "pages/DailyReport/SendToServerDialog";
import LoginPanel from "pages/LoginPanel";
import {
  useRecoilState,
} from 'recoil'
import { loggedInState, loggedUser, loggedUserRole } from "pages/Dashboard";
import Spinner from "widgets/Spinner";
import { FormProvider, useForm } from 'react-hook-form';
import { DailyWorkReportType } from "types/dailyWorkReportTypes";

const DailyReport = () => {

  const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
  const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
  const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);

  const [pdfData, setPdfData] = useState<AllPdfStats>(new AllPdfStats());
  const [snackBarMsg, setSnackBarMsg] = useState<string[]>(["", ""]);
  const [password, setPassword] = useState<string>("");
  const [disabledState, setDisabledState] = useState<boolean>(false);
  const [center, setCenter] = React.useState<string>(centers[0]);

  const [isLoading, setIsLoading] = useState<boolean>(false);


  const dataHoldingElement = useRef();
  const copyButton = useRef();
  const clearButton = useRef();

  const getLibrariesInCenter = (_center: string = ""): string[] => {
    const obj = libraryMenuOptions.find((o) => o.name === (_center || center));
    const _libraries = obj?.centers || [];
    return _libraries;
  };

  const [libraries, setLibraries] = React.useState<string[]>(
    getLibrariesInCenter()
  );
  const [library, setLibrary] = React.useState<string>(libraries[0]);


  const clearResults = () => {
    setPdfData(new AllPdfStats());
    setDisabledState(true);
    setSnackBarMsg(["", ""]);
  };

  const handleCenterChange = (event: SelectChangeEvent) => {
    const val = event.target.value;
    console.log(`val ${val}`);
    setCenter(val);
    const _libraries = getLibrariesInCenter(val);
    setLibrary(_libraries[0]);
    setLibraries(_libraries);
  };

  const handleLibChange = (event: SelectChangeEvent) => {
    const val = event.target.value;
    console.log(`val ${val}`);
    setLibrary(val);
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
          library
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
  const { handleSubmit, watch } = methods;
  const onFormSubmit = async (formData: DailyWorkReportType) => {
    //createSnapshotLocation(formData);
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
            <Box sx={{ display: "flex", flexDirection: "row" }}>
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
                  {centers.map((option: string) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
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
            </Box>
            <label htmlFor="upload-pdf">
              <input
                style={{ display: "none" }}
                id="upload-pdf"
                name="upload-pdf"
                type="file"
                multiple
                accept=".pdf"
                disabled={!_isLoggedIn || center === centers[0]}
                onChange={uploadPdf}
              />
              <Button
                color="primary"
                variant="contained"
                component="span"
                disabled={!_isLoggedIn || center === centers[0]}
                endIcon={<GoFileMedia style={{ color: "primary" }} />}
              >
                Choose PDFs
              </Button>
            </label>
            <Stack spacing={2} direction="row">
              <SendReportDialog pdfData={pdfData} setPdfData={setPdfData} snackBarMsg={snackBarMsg} setSnackBarMsg={setSnackBarMsg} password={password} />
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
            <Box ref={dataHoldingElement}>{AllPdfStats.decorate(pdfData)}</Box>
            <Box sx={{ paddingTop: "30px" }}></Box>
            </Stack>
          </form>
        </FormProvider>
      </Stack>

      );
};

      export default DailyReport;
