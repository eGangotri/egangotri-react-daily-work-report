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
  Grid,
} from "@mui/material";
import _, { add, set } from "lodash";
import React, { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { getLibrariesInCenter, SCAN_CENTERS, panelOneCSS, getCentersAndLibraries } from "service/CentersService";
import LoginPanel from "pages/LoginPanel";
import {
  useRecoilState,
} from 'recoil';
import TextField from '@mui/material/TextField';

import { loggedInState, loggedUser, loggedUserRole, loggedUserPassword } from "../../index";
import Spinner from "widgets/Spinner";
import { FormProvider, useForm } from 'react-hook-form';
import Typography from "@mui/material/Typography";
import SendGDriveReportDialog from "./SendGDriveReportToServerDialog";
import { GDriveUploadWorkReportType } from "mirror/types";
import { DecorateGDriveWorkReport } from "utils/AllGDriveUploadLinkReportStats";
import { text } from "stream/consumers";


const emptyQAStats = {
  center: "",
  lib: "",
  timeOfRequest: new Date().toDateString(),
  dateOfReport: new Date(),
  notes: "",
  gDriveLinks: [],
  operatorName: "",
} as GDriveUploadWorkReportType

const staffWithOperatorName = (_operatorName: string) => {
  emptyQAStats.operatorName = _operatorName;
  return emptyQAStats;
};

const GDriveUploadeport = () => {

  const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
  const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
  const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);
  const [_loggedUserPassword, setLoggedUserPassword] = useRecoilState(loggedUserPassword);

  const [gDriveUploadReport, setGDriveUploadReport] = useState<GDriveUploadWorkReportType>(staffWithOperatorName(_loggedUser));
  const [snackBarMsg, setSnackBarMsg] = useState<[string, ReactNode]>(["", (<></>)]);
  const [disabledState, setDisabledState] = useState<boolean>(false);

  const [center, setCenter] = React.useState<string>("");
  const [_notes, setNotes] = React.useState<string>("");
  const [gDriveLinks, setGDriveLinks] = React.useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gDriveInvalidErrorMsg, setGgDriveInvalidErrorMsg] = useState<string>("");
  const cssForInputBox = { width: { xs: "80px", sm: "100px", md: "120px" } }

  const dataHoldingElement = useRef();
  const copyButton = useRef();
  const clearButton = useRef();


  const [libraries, setLibraries] = React.useState<string[]>([]);
  const [library, setLibrary] = React.useState<string>("");

  const clearResults = () => {
    setGDriveUploadReport(staffWithOperatorName(_loggedUser));
    setDisabledState(true);
    setSnackBarMsg(["", ""]);
    setNotes("");
    setGDriveLinks([]);
  };

  const notesOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setNotes(val);
    const _gDriveWorkData = {
      ...gDriveUploadReport,
      notes: val,
    }
    setGDriveUploadReport(_gDriveWorkData);
  }


  const handleCenterChange = (event: SelectChangeEvent) => {
    const val = event.target.value;
    console.log(`val ${val}`);
    setCenter(val);
    const _libraries = getLibrariesInCenter(val);
    setLibrary(_libraries[0]);
    setLibraries(_libraries);
    const updatedGDriveWorkData = {
      ...gDriveUploadReport,
      lib: _libraries[0],
      center: val,
    }
    setGDriveUploadReport(updatedGDriveWorkData);
  };

  const handleLibChange = (event: SelectChangeEvent) => {
    const val = event.target.value;
    console.log(`val ${val}`);
    setLibrary(val);
    const updatedQAWorkData = {
      ...gDriveUploadReport,
      library: val,
    }
    setGDriveUploadReport(updatedQAWorkData);
  };

  const methods = useForm<GDriveUploadWorkReportType>();
  const { handleSubmit } = methods;
  const onFormSubmit = async (formData: GDriveUploadWorkReportType) => {
    console.log(`formData ${JSON.stringify(formData)}`);
  };
  const [textBoxes, setTextBoxes] = useState<string[]>(['']);
  const textBoxRefs = useRef<(HTMLInputElement | HTMLTextAreaElement)[]>([]);

  const handleAddTextBox = () => {
    setTextBoxes([...textBoxes, '']);
  };
  const handleMinusTextBox = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const newTextBoxes = textBoxes.filter((_, i) => i !== index);
    setTextBoxes(newTextBoxes);
    const newValues = gDriveLinks.filter((_, i) => i !== index);
    setGDriveLinks(newValues);
    setGDriveUploadReport({ ...gDriveUploadReport, gDriveLinks: newValues, operatorName: _loggedUser });
  };

  const handleTextBoxChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const input = event.target.value;
    console.log(`input ${input}(${index}) ${textBoxRefs.current[index]}`);
    console.log(`input?.trim().startsWith("https://drive.google.com/) 
      ${input?.trim().startsWith("https://drive.google.com/")}`);

    if (!input?.trim().startsWith("https://drive.google.com/") && input?.trim().length > 0) {
      if (textBoxRefs.current[index]) {
        textBoxRefs.current[index].style.background = 'red';
        setGgDriveInvalidErrorMsg("*Cannot be empty or not a valid G-Drive Link");
      }
    }
    else {
      setGgDriveInvalidErrorMsg("");
      textBoxRefs.current[index].style.background = '';
    }
    const newValues = [...gDriveLinks];
    newValues[index] = input
    setGDriveLinks(newValues);
    setGDriveUploadReport({ ...gDriveUploadReport, gDriveLinks: newValues, operatorName: _loggedUser });
    console.log(`gDriveLinks ${gDriveLinks}`);
    const newTextBoxes = [...textBoxes];
    newTextBoxes[index] = input;
    setTextBoxes(newTextBoxes);
  }

  useEffect(() => {
    getCentersAndLibraries().then((centersData) => {
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
                    {SCAN_CENTERS.map((option: string) => (
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

            <Stack spacing={5} direction="row">
              <Typography>G Drive Links of Uploads</Typography>
              <Box>
                {textBoxes.map((textBox, index) => (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                    <TextField
                      key={index}
                      value={textBox}
                      sx={{ minWidth: "700px", paddingBottom: "10px" }}
                      onChange={(event) => handleTextBoxChange(event, index)}
                      inputRef={(el) => (textBoxRefs.current[index] = el)}
                    />
                    {index == textBoxes.length-1 && <Button sx={{ padding: "0" }} onClick={handleAddTextBox}><h2>+</h2></Button>}
                    {index != textBoxes.length-1 && <Button sx={{ padding: "0" }} onClick={(event) => handleMinusTextBox(event, index)}><h2>-</h2></Button>}
                  </Box>
                ))}
                <Box sx={{color:"red"}}>{gDriveInvalidErrorMsg}</Box>
              </Box>
            </Stack>
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
              <SendGDriveReportDialog gDriveUploadData={gDriveUploadReport} setGDriveUploadData={setGDriveUploadReport} snackBarMsg={snackBarMsg} setSnackBarMsg={setSnackBarMsg} password={_loggedUserPassword} />
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
            <Box ref={dataHoldingElement}><DecorateGDriveWorkReport all={gDriveUploadReport} /></Box>
            <Box sx={{ paddingTop: "30px" }}></Box>
          </Stack>
        </form>
      </FormProvider>
    </Stack>

  );
};

export default GDriveUploadeport;
