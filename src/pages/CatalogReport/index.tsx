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
import { panelOneCSS, catalogProfiles } from "pages/constants";
import LoginPanel from "pages/LoginPanel";
import {
    useRecoilState,
} from 'recoil'
import { loggedInState, loggedUser, loggedUserRole } from "pages/Dashboard";
import Spinner from "widgets/Spinner";
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import SendCatalogReportToServerDialog from "./SentCatalogReportToServerDialog";
import AllCatalogReportStats from "utils/AllCatalogReportStats";
import { FormProvider, useForm } from 'react-hook-form';
import { CatalogWorkReportType } from "mirror/catalogWorkReportTypes";

const CatalogReport = () => {

    const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
    const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);
    const [password, setPassword] = useState<string>("");

    const [catalogStats, setCatalogStats] = useState<CatalogWorkReportType>({
        title: 'eGangotri Daily Catalog Work Report',
        operatorName: _loggedUser,
        catalogProfile: "",
        entryFrom: 0,
        entryTo: 0,
        timeOfRequest: new Date(),
        entryCount: 0,
        link: '',
        notes: '',
    } as CatalogWorkReportType);
    const [snackBarMsg, setSnackBarMsg] = useState<string[]>(["", ""]);
    const [disabledState, setDisabledState] = useState<boolean>(false);
    const [catalogProfile, setCatalogProfile] = React.useState<string>(catalogProfiles[0]);
    const [entryFrom, setEntryFrom] = React.useState<number>(0);
    const [entryTo, setEntryTo] = React.useState<number>(0);
    const [entryCount, setEntryCount] = React.useState<number>(0);
    const [_link, setLink] = React.useState<string>("");
    const [_notes, setNotes] = React.useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const dataHoldingElement = useRef();
    const copyButton = useRef();
    const clearButton = useRef();

    const clearResults = () => {
        //setCatalogStats();
        setDisabledState(true);
        setEntryFrom(0)
        setEntryTo(0)
        setEntryCount(0)
        setSnackBarMsg(["", ""]);
        setCatalogProfile(catalogProfiles[0])
        setNotes("")
        setLink("")
    };

    const handleProfileChange = (event: SelectChangeEvent) => {
        const val = event.target.value;
        console.log(`val ${val}`);
        setCatalogProfile(val);
        setCatalogStats((prevState) => ({
            ...prevState,
            catalogProfile: val
        }));
    };

    const entryFromOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const _entryFrom = parseInt(event.target.value);
        const _entryCount = entryTo - _entryFrom
        setEntryFrom(_entryFrom);
        setEntryCount(_entryCount)
        setCatalogStats((prevState) => ({
            ...prevState,
            entryCount: _entryCount,
            entryFrom: _entryFrom,
            operatorName: _loggedUser,
        }));

    }

    const entryToOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEntryTo(parseInt(event.target.value));
        const _entryTo = parseInt(event.target.value);
        const _entryCount = _entryTo - entryFrom;
        setEntryTo(_entryTo);
        setEntryCount(_entryCount);
        setCatalogStats((prevState) => ({
            ...prevState,
            entryCount: _entryCount,
            entryTo: _entryTo,
        }));
    }

    const notesOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const _notes = event.target.value;
        setNotes(event.target.value)
        setCatalogStats((prevState) => ({
            ...prevState,
            notes: _notes,
        }));
    }

    const linkOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const _link = event.target.value;
        setLink(event.target.value)
        setCatalogStats((prevState) => ({
            ...prevState,
            link: _link,
        }));
    }

    return (
        <Stack spacing={2}>
            {isLoading && <Spinner />}
            <>
                <LoginPanel />
            </>
            <>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Box sx={panelOneCSS}>
                        <InputLabel id="l1">Profile</InputLabel>
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
                        onChange={entryFromOnChange}
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
                        onChange={entryToOnChange}
                        value={entryTo}
                        sx={{ width: "120px" }}
                        variant="filled"
                    />
                </Stack>
                <Box>
                    {(entryCount < 0) &&
                        <Typography><span style={{ color: 'red' }}>Count cannot be negative</span></Typography>
                    }
                    <Typography>Total Items Cataloged <span style={{ fontWeight: 'bold' }}>{entryCount}</span></Typography>
                </Box>

                <Stack spacing={5} direction="row">
                    <Typography>Catalog Link </Typography>
                    <TextField
                        required
                        id="_link"
                        type="text"
                        label="Required"
                        onChange={linkOnChange}
                        value={_link}
                        sx={{ width: "400px" }} />
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
                    <SendCatalogReportToServerDialog
                        catReport={catalogStats}
                        setCatReport={setCatalogStats}
                        snackBarMsg={snackBarMsg}
                        setSnackBarMsg={setSnackBarMsg}
                        password={password} />
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
                <Box ref={dataHoldingElement}>{AllCatalogReportStats.decorate(catalogStats)}</Box>
                <Box sx={{ paddingTop: "30px" }}></Box>

            </>

        </Stack>

    );
};

export default CatalogReport;
