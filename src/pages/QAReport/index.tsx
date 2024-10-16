import "./QAReport.css";

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
import _, { add, set } from "lodash";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { SCAN_CENTERS, panelOneCSS, getLibrariesInCenter, getCentersAndLibraries } from "service/CentersService";
import LoginPanel from "pages/LoginPanel";
import {
  useRecoilState,
} from 'recoil';
import TextField from '@mui/material/TextField';

import { loggedInState, loggedUser, loggedUserRole, loggedUserPassword } from "../../index";
import Spinner from "widgets/Spinner";
import { FormProvider, useForm } from 'react-hook-form';
import Typography from "@mui/material/Typography";
import { QAWorkReportType } from "mirror/qaWorkReportType";
import SendQAReportDialog from "./SendQAReportToServerDialog";
import { DecorateQAWorkReport } from "utils/AllQAReportStats";
import CenterLibrarySelector from "pages/common/CenterLibrarySelector";


const emptyQAStats = {
  center: "",
  lib: "",
  timeOfRequest: new Date().toDateString(),
  dateOfReport: new Date(),
  notes: "",
  operatorName: "",
  folderNames: "",
  pdfsRenamedCount: 0,
  coverPagesRenamedCount: 0,
  coverPagesMoved: false
} as QAWorkReportType

const qaStaffWithOperatorName = (_operatorName: string) => {
  emptyQAStats.operatorName = _operatorName;
  return emptyQAStats;
};

const QAReport = () => {

  const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
  const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
  const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);
  const [_loggedUserPassword, setLoggedUserPassword] = useRecoilState(loggedUserPassword);

  const [qaWorkData, setQAWorkData] = useState<QAWorkReportType>(qaStaffWithOperatorName(_loggedUser));
  const [snackBarMsg, setSnackBarMsg] = useState<[string, ReactNode]>(["", (<></>)]);
  const [disabledState, setDisabledState] = useState<boolean>(false);

  const [center, setCenter] = React.useState<string>("");
  const [_notes, setNotes] = React.useState<string>("");
  const [folderNames, setFolderNames] = React.useState<string>("");

  const [pdfsRenamedCount, setPdfsRenamedCount] = React.useState<string>("");
  const [coverPagesRenamedCount, setCoverPagesRenamedCount] = React.useState<string>("");
  const [coverPagesMoved, setCoverPagesMoved] = React.useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const cssForInputBox = { width: { xs: "80px", sm: "100px", md: "120px" } }

  const dataHoldingElement = useRef();
  const copyButton = useRef();
  const clearButton = useRef();

  const [libraries, setLibraries] = React.useState<string[]>([]);
  const [library, setLibrary] = React.useState<string>("");

  const clearResults = () => {
    setQAWorkData(qaStaffWithOperatorName(_loggedUser));
    setDisabledState(true);
    setSnackBarMsg(["", ""]);
    setNotes("");
    setFolderNames("");
    setPdfsRenamedCount("0");
    setCoverPagesRenamedCount("0");
    setCoverPagesMoved(false);
  };

  const notesOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setNotes(val);
    const updatedQAWorkData = {
      ...qaWorkData,
      notes: val,
    }
    setQAWorkData(updatedQAWorkData);
  }

  const folderNamesOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setFolderNames(val);
    const updatedQAWorkData = {
      ...qaWorkData,
      folderNames: val,
    }
    setQAWorkData(updatedQAWorkData);
  }

  const handleCenterChange = (event: SelectChangeEvent) => {
    const val = event.target.value;
    console.log(`val ${val}`);
    setCenter(val);
    const _libraries = getLibrariesInCenter(val);
    setLibrary(_libraries[0]);
    setLibraries(_libraries);
    const updatedQAWorkData = {
      ...qaWorkData,
      lib: _libraries[0],
      center: val,
    }
    setQAWorkData(updatedQAWorkData);
  };

  const handleLibChange = (event: SelectChangeEvent) => {
    const val = event.target.value;
    console.log(`val ${val}`);
    setLibrary(val);
    const updatedQAWorkData = {
      ...qaWorkData,
      library: val,
    }
    setQAWorkData(updatedQAWorkData);
  };


  const pdfsRenamedCountOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = event.target.value;
    setPdfsRenamedCount(_value);
    const _pdfsRenamedCount = (isNaN(parseInt(_value)) ? "0" : _value);
    const updatedQAWorkData = {
      ...qaWorkData,
      pdfsRenamedCount: parseInt(_pdfsRenamedCount),
    }
    setQAWorkData(updatedQAWorkData);
  }

  const coverPagesRenamedCountOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = event.target.value;
    setCoverPagesRenamedCount(_value);
    const _cpsRenamedCount = (isNaN(parseInt(_value)) ? "0" : _value);
    const updatedQAWorkData = {
      ...qaWorkData,
      coverPagesRenamedCount: parseInt(_cpsRenamedCount),
    }
    setQAWorkData(updatedQAWorkData);
  }


  const handleCPsMoved = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _cpsMoved = event.target.checked;
    console.log(`_cpsMoved ${_cpsMoved}`);
    setCoverPagesMoved(_cpsMoved);
    const updatedQAWorkData = {
      ...qaWorkData,
      coverPagesMoved: _cpsMoved,
    }
    setQAWorkData(updatedQAWorkData);
  };

  const methods = useForm<QAWorkReportType>();
  const { handleSubmit } = methods;
  const onFormSubmit = async (formData: QAWorkReportType) => {
    console.log(`formData:onFormSubmit}`);
  };

  useEffect(() => {
    getCentersAndLibraries().then(() => {
      setCenter(SCAN_CENTERS[0]);
      const _libraries = getLibrariesInCenter(SCAN_CENTERS[0]);
      setLibrary(_libraries[0]);
      setLibraries(_libraries);
    })
  }, []);

  return (
    <Stack spacing={2}>
      {isLoading && <Spinner />}
      <>
        <LoginPanel />
      </>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Stack spacing={2} direction="column">
          <CenterLibrarySelector
              center={center}
              library={library}
              libraries={libraries}
              SCAN_CENTERS={SCAN_CENTERS}
              panelOneCSS={panelOneCSS}
              _isLoggedIn={_isLoggedIn}
              handleCenterChange={handleCenterChange}
              handleLibChange={handleLibChange}
            />

            <Stack spacing={5} direction="row">
              <Typography>Folder Names Worked On (comma-separated)</Typography>
              <TextField
                id="folderNames"
                type="text"
                onChange={folderNamesOnChange}
                sx={{ width: "400px" }}
                value={folderNames}
                multiline={true}
                maxRows={3} />
            </Stack>
            <Grid container columns={{ xs: 3, sm: 6, md: 12 }} direction="row">
              <Grid item xs={1} sm={2} md={3}>
                <Typography>Pdfs Renamed Count</Typography>
                <TextField
                  required
                  id="pdfsRenamedCount"
                  type="text"
                  label="Required"
                  onChange={pdfsRenamedCountOnChange}
                  value={pdfsRenamedCount}
                  sx={cssForInputBox}
                  variant="filled"
                />
              </Grid>
              <Grid item xs={1} sm={2} md={3}>
                <Typography>Cover Pages Renamed Count</Typography>
                <TextField
                  required
                  id="coverPagesRenamedCount"
                  type="text"
                  label="Required"
                  onChange={coverPagesRenamedCountOnChange}
                  value={coverPagesRenamedCount}
                  sx={cssForInputBox}
                  variant="filled"
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item sx={{ paddingLeft: 0, paddingTop: 0 }}>
                <FormControlLabel sx={{ marginLeft: 0 }}
                  control={<Checkbox
                    checked={coverPagesMoved}
                    onChange={handleCPsMoved} />}
                  label="CPs Moved ?"
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
            <Stack spacing={2} direction="row">
              <SendQAReportDialog qaWorkData={qaWorkData} setQAWorkData={setQAWorkData} snackBarMsg={snackBarMsg} setSnackBarMsg={setSnackBarMsg} password={_loggedUserPassword} />
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
            <Box ref={dataHoldingElement}><DecorateQAWorkReport all={qaWorkData} /></Box>
            <Box sx={{ paddingTop: "30px" }}></Box>
          </Stack>
        </form>
      </FormProvider>
    </Stack>

  );
};

export default QAReport;
