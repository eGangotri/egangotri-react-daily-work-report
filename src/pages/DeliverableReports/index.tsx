import React, { useState } from "react";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import {
    useRecoilState,
} from 'recoil';
import { loggedInState, loggedUser, loggedUserRole } from "pages/Dashboard";
import LoginPanel from "pages/LoginPanel";
import { panelOneCSS } from "pages/constants";

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FaRegTrashAlt } from "react-icons/fa";

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { sendFilteredFormToServer } from "api/service/callApi";
import { BASIC_ROLE } from "utils/DailyReportUtil";


const DeliverableReports = () => {
    const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
    const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);

    const [operators, setOperators] = useState("");
    const [centers, setCenters] = useState("");

    const [selectedStartDate, setSelectedStartDate] = React.useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(null);

    const filterReport = () => {
        console.log(`filterReport`);
        sendFilteredFormToServer(operators, centers, selectedStartDate, selectedEndDate)
    }
    const [value, setValue] = React.useState<DateRange<Dayjs | null>>([
        dayjs(new Date()),
        dayjs(new Date()),
    ]);

    const clearResults = () => {
        setIsLoggedIn(false);
        setLoggedUser(""); 
        setLoggedUserRole(BASIC_ROLE);
    };


    const onDatePickerChange = (newValue: DateRange<Dayjs>) => {
        console.log(`newValue ${newValue[0]}`)
        setSelectedStartDate(newValue[0]?.toDate() || null);
        console.log(`newValue ${newValue[1]}`)
        setSelectedEndDate(newValue[1]?.toDate() || null);
        setValue(newValue);
    }

    return (
        <Stack spacing={2}>
            <Box>
                <LoginPanel />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                {_isLoggedIn ?
                    <>
                        <Box sx={panelOneCSS} alignItems="columns">
                            <Typography>Filter by Operator Name:{" "}</Typography>
                            <Typography>(Use comman separation for multiple values):{" "}</Typography>
                            <TextField
                                variant="outlined"
                                label="Required"
                                size="small"
                                onChange={(e) => setOperators(e.target.value)}
                            />
                        </Box>
                        <Box sx={panelOneCSS} alignItems="columns">
                            <Typography>Filter by Centers :{" "}</Typography>
                            <Typography>(Use comman separation for multiple values):{" "}</Typography>
                            <TextField
                                variant="outlined"
                                label="Required"
                                size="small"
                                onChange={(e) => setCenters(e.target.value)}
                            />
                        </Box>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
                                <DemoItem label="Filter by Time: " component="DateRangePicker">
                                    <DateRangePicker
                                        value={value}
                                        onChange={(newValue: DateRange<Dayjs>) => onDatePickerChange(newValue)}
                                    />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>
                        <Button
                            color="primary"
                            variant="contained"
                            component="span"
                            onClick={() => filterReport()}
                        >
                            Filter Report
                        </Button>
                        <Box></Box>
                        <Button
                            variant="contained"
                            endIcon={<FaRegTrashAlt style={{ color: "primary" }} />}
                            onClick={() => clearResults()}
                        >
                            Clear
                        </Button>
                    </>
                    :
                    <></>}
            </Box>
        </Stack>
    )
}
export default DeliverableReports