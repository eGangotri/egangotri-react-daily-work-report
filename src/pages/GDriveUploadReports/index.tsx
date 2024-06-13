import React, { useState } from "react";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import {
    useRecoilState,
} from 'recoil';
import { loggedInState, loggedUser, loggedUserRole, loggedUserPassword } from "../../index";

import LoginPanel from "pages/LoginPanel";
import { panelOneCSS } from "pages/constants";
import { ADMIN_ROLE, SUPERADMIN_ROLE } from 'mirror/FrontEndBackendCommonConsts'

import { FaRegTrashAlt } from "react-icons/fa";

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import _ from "lodash";
import moment from "moment";
import { DD_MM_YYYY_FORMAT } from "utils/DailyReportUtil";
import Spinner from "widgets/Spinner";
import { CATALOG_REPORTS_METADATA_PATH, QA_REPORTS_METADATA_PATH } from "Routes";
import { sendFilteredFormToServerGet, sendFilteredFormToServerGetForBasicUser } from "api/service/ScannerReportService";


const GDriveUploadeports = () => {
    const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
    const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);
    const [_loggedUserPassword, setLoggedUserPassword] = useRecoilState(loggedUserPassword);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [operators, setOperators] = useState("");
    const [centers, setCenters] = useState("");

    const [selectedStartDate, setSelectedStartDate] = React.useState<string | null>(null);
    const [selectedEndDate, setSelectedEndDate] = React.useState<string | null>(null);
    console.log(`generateReport`, window.location.pathname);

    const generateReport = async (aggregations: boolean = false) => {
        const pathname = window.location.pathname
        console.log(`generateReport`, window.location.pathname);
        setIsLoading(true);
        if (_loggedUserRole === SUPERADMIN_ROLE || _loggedUserRole === ADMIN_ROLE) {
            await sendFilteredFormToServerGet(operators,
                centers,
                selectedStartDate,
                selectedEndDate,
                aggregations,
                _loggedUserPassword,
                pathname === QA_REPORTS_METADATA_PATH,
            );
        }
        else {
            await sendFilteredFormToServerGetForBasicUser(_loggedUser,
                selectedStartDate,
                selectedEndDate,
                aggregations,
                _loggedUserPassword,
                pathname === QA_REPORTS_METADATA_PATH
            );
        }
        setIsLoading(false);
    }

    const generateAggregatedReport = async () => {
        generateReport(true);
    }
    const [dayRangeValue, setDayRangeValue] = React.useState<DateRange<Dayjs | null>>([
        dayjs(null),
        dayjs(null),
    ]);

    const clearResults = () => {
        setOperators("")
        setCenters("")
        setDayRangeValue([
            dayjs(null),
            dayjs(null),
        ]);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
    };


    const onDatePickerChange = (newDayRangeValue: DateRange<Dayjs>) => {
        console.log(`newValue ${newDayRangeValue[0]}`)
        const _newValue = moment(newDayRangeValue[0]?.toDate());
        setSelectedStartDate(_newValue.format(DD_MM_YYYY_FORMAT));
        console.log(`newValue ${newDayRangeValue[1]}`)
        setSelectedEndDate(moment(newDayRangeValue[1]?.toDate()).format(DD_MM_YYYY_FORMAT) || null);
        setDayRangeValue(newDayRangeValue);
    }

    return (
        <Stack spacing={2}>
            {isLoading && <Spinner />}
            <Box>
                <LoginPanel />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                {_isLoggedIn ?
                    <Stack spacing={2}>
                        {(_loggedUserRole === SUPERADMIN_ROLE || _loggedUserRole === ADMIN_ROLE) && <Box sx={panelOneCSS} alignItems="columns">
                            <Typography>Filter by Operator Name:{" "}</Typography>
                            <Typography>(Use comman separation for multiple values):{" "}</Typography>
                            <TextField
                                variant="outlined"
                                label="Required"
                                size="small"
                                value={operators}
                                onChange={(e) => setOperators(e.target.value)}
                            />
                        </Box>}
                        {(_loggedUserRole === SUPERADMIN_ROLE || _loggedUserRole === ADMIN_ROLE) && <Box sx={panelOneCSS} alignItems="columns">
                            <Typography>Filter by Centers :{" "}</Typography>
                            <Typography>(Use comman separation for multiple values):{" "}</Typography>
                            <TextField
                                variant="outlined"
                                label="Required"
                                size="small"
                                value={centers}
                                onChange={(e) => setCenters(e.target.value)}
                            />
                        </Box>}

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
                                <DemoItem label="Filter by Time: " component="DateRangePicker">
                                    <DateRangePicker
                                        sx={{ width: "500px" }}
                                        value={dayRangeValue}
                                        onChange={(newValue: DateRange<Dayjs>) => onDatePickerChange(newValue)}
                                    />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>
                        <Stack spacing="2" direction="row">
                            <Box sx={{margin:'0 20px 0 0'}}>
                                <Button
                                color="primary"
                                variant="contained"
                                component="span"
                                onClick={() => generateReport()}
                                sx={{ width: "180px" }}
                            >
                                Generate Report
                            </Button>
                            </Box>
                            <Button
                                color="primary"
                                variant="contained"
                                component="span"
                                onClick={() => generateAggregatedReport()}
                                sx={{ width: "300px" }}
                            >
                                Generate Aggregated Report
                            </Button>
                        </Stack>
                        <Button
                            variant="contained"
                            endIcon={<FaRegTrashAlt style={{ color: "primary" }} />}
                            onClick={() => clearResults()}
                            sx={{ width: "100px", textAlign: "left" }}
                        >
                            Clear
                        </Button>
                    </Stack>
                    :
                    <></>}
            </Box>
        </Stack>
    )
}
export default GDriveUploadeports