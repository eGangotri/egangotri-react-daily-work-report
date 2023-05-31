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
import { libraryMenuOptions, centers } from "pages/constants";
import SendReportDialog from "pages/DailyReport/SendToServerDialog";
import LoginPanel from "pages/LoginPanel";
import {
  useRecoilState,
} from 'recoil'
import { loggedInState, loggedUser } from "pages/Dashboard";

const DailyReport = () => {

  const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
  const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);

  const [pdfData, setPdfData] = useState<AllPdfStats>(new AllPdfStats());
  const [snackBarOpen, setSnackBarOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [disabledState, setDisabledState] = useState<boolean>(false);
  const [center, setCenter] = React.useState<string>(centers[0]);


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

  const panelOneCSS = { bgcolor: "white", marginRight: "10px" };

  const clearResults = () => {
    setIsLoggedIn(false);
    setLoggedUser("");
    setPassword("");
    setPdfData(new AllPdfStats());
    setDisabledState(true);
    setSnackBarOpen(false);
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
      const data = await HelperService.processFiles(
        Array.from(files!),
        _loggedUser,
        center,
        library
      );
      setPdfData(data);
    }
  };

  return (
    <Stack spacing={2}>
      <Box>
        <LoginPanel />
      </Box>
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
        {/* <Button
          color="primary"
          variant="contained"
          component="span"
         // disabled={!loggedIn || AllPdfStats.isEmpty(pdfData)}
          endIcon={<FaUpload style={{ color: "primary" }} />}
         // onClick={() => prepareReportForPush()}
        >
          Send to Server
        </Button> */}

        <SendReportDialog pdfData={pdfData} setPdfData={setPdfData} snackBarOpen={snackBarOpen} setSnackBarOpen={setSnackBarOpen} password={password} />

        {/* <Button
          variant="contained"
          endIcon={<FaCopy style={{ color: "primary" }} />}
          onClick={copyResults}
          disabled={AllPdfStats.isEmpty(pdfData)}
        >
          Copy
        </Button> */}
        <Button
          variant="contained"
          endIcon={<FaRegTrashAlt style={{ color: "primary" }} />}
          onClick={() => clearResults()}
          disabled={AllPdfStats.isEmpty(pdfData)}
        >
          Clear
        </Button>
        <Box>
          <Snackbar open={snackBarOpen} autoHideDuration={6000}>
            <Alert severity="success" sx={{ width: '100%' }}>
              Report Sent succcessfully. Now paste report in your whatsapp group
            </Alert>
          </Snackbar>
        </Box>
      </Stack>
      <Box ref={dataHoldingElement}>{AllPdfStats.decorate(pdfData)}</Box>

    </Stack>

  );
};

export default DailyReport;
