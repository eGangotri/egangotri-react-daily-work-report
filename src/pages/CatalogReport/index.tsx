import "./CatalogReport.css";

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
import { centers, panelOneCSS, catalogProfiles } from "pages/constants";
import SendReportDialog, { SUCCESS_MSG } from "pages/DailyReport/SendToServerDialog";
import LoginPanel from "pages/LoginPanel";
import {
    useRecoilState,
} from 'recoil'
import { loggedInState, loggedUser, loggedUserRole } from "pages/Dashboard";
import Spinner from "widgets/Spinner";
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";

const CatalogReport = () => {

    const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
    const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);
    const [password, setPassword] = useState<string>("");

    const [catalogStats, setCatalogStats] = useState<AllPdfStats>(new AllPdfStats());
    const [snackBarMsg, setSnackBarMsg] = useState<string[]>(["", ""]);
    const [disabledState, setDisabledState] = useState<boolean>(false);
    const [catalogProfile, setCatalogProfile] = React.useState<string>(catalogProfiles[0]);
    const [entryFrom, setEntryFrom] = React.useState<number>(0);
    const [entryTo, setEntryTo] = React.useState<number>(0);
    const [_notes, setNotes] = React.useState<string>("");
    
    const [totalEntries, setTotalEntries] = React.useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);


    const dataHoldingElement = useRef();
    const copyButton = useRef();
    const clearButton = useRef();

    const clearResults = () => {
        setCatalogStats(new AllPdfStats());
        setDisabledState(true);
        setEntryFrom(0)
        setEntryTo(0)
        setSnackBarMsg(["", ""]);
        setCatalogProfile(catalogProfiles[0])
        setNotes("")
    };

    const handleProfileChange = (event: SelectChangeEvent) => {
        const val = event.target.value;
        console.log(`val ${val}`);
        setCatalogProfile(val);
    };

    return (
        <Stack spacing={2}>
            {isLoading && <Spinner />}
            <>
                <LoginPanel />
            </>
            <>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Box sx={panelOneCSS}>
                        <InputLabel id="l1">Center</InputLabel>
                    </Box>
                    <Box sx={panelOneCSS}>
                        <Select
                            labelId="l1"
                            id="demo-simple-select-standard"
                            value={catalogProfile}
                            onChange={handleProfileChange}
                            sx={{ minWidth: '200px' }}
                            disabled={!_isLoggedIn}
                        >
                            {catalogProfiles.map((option: string) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>
                <Box><Typography>Enter Start and End Index you have cataloged</Typography></Box>
                <Stack spacing={5} direction="row">
                        <Typography>From</Typography>
                        <TextField
                            required
                            id="entryFrom"
                            type="number"
                            label="Required"
                            onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setEntryFrom(parseInt(event.target.value))}
                            //defaultValue="Entry From"
                            value={entryFrom}
                            sx={{ width: "120px" }}
                            variant="filled"
                        />
                        <Typography>To</Typography>
                        <TextField
                            required
                            id="entryTo"
                            type="number"
                            label="Required"
                            onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setEntryTo(parseInt(event.target.value))}
                            defaultValue="Entry To"
                            value={entryTo}
                            sx={{ width: "120px" }}
                            variant="filled"
                        />
                </Stack>
                <Box>
                    {((entryTo-entryFrom)< 0) && 
                    <Typography><span style={{ color: 'red' }}>Count cannot be negative</span></Typography>
                    }
                    <Typography>Total Items Cataloged <span style={{ fontWeight: 'bold' }}>{entryTo-entryFrom}</span></Typography>
                </Box>

                <Stack spacing={5} direction="row">
                    <Typography>Catalog Link </Typography>
                    <TextField sx={{width:"400px"}} value={_notes} multiline={true} maxRows={3}>XXXX</TextField>
                </Stack>
                
                <Stack spacing={5} direction="row">
                    <Typography>Notes</Typography>
                    <TextField sx={{width:"400px"}} value={_notes} multiline={true} maxRows={3}>XXXX</TextField>
                </Stack>

                <Stack spacing={2} direction="row">
                    <SendReportDialog pdfData={catalogStats} setPdfData={setCatalogStats} snackBarMsg={snackBarMsg} setSnackBarMsg={setSnackBarMsg} password={password} />
                    <Button
                        variant="contained"
                        endIcon={<FaRegTrashAlt style={{ color: "primary" }} />}
                        onClick={() => clearResults()}
                        disabled={!_isLoggedIn}
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
                <Box ref={dataHoldingElement}>{AllPdfStats.decorate(catalogStats)}</Box>
                <Box sx={{ paddingTop: "30px" }}></Box>

            </>

        </Stack>

    );
};

export default CatalogReport;
