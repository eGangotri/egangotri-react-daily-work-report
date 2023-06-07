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
import { sendFilteredFormToServerGet, sendFilteredFormToServerPost } from "api/service/DailyReportService";
import _ from "lodash";
import moment from "moment";
import { DD_MM_YYYY_FORMAT } from "utils/DailyReportUtil";
import Spinner from "widgets/Spinner";


const DeliverableReports = () => {
    const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
    const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [operators, setOperators] = useState("");
    const [centers, setCenters] = useState("");

    const [selectedStartDate, setSelectedStartDate] = React.useState<string | null>(null);
    const [selectedEndDate, setSelectedEndDate] = React.useState<string | null>(null);

    const filterReport = async () => {
        console.log(`filterReport`);
        setIsLoading(true);
        await sendFilteredFormToServerGet(operators, centers, selectedStartDate, selectedEndDate);
        setIsLoading(false);
    }

    const [dayRangeValue, setDayRangeValue] = React.useState<DateRange<Dayjs | null>>([
        dayjs(new Date()),
        dayjs(new Date()),
    ]);

    const clearResults = () => {
        console.log("clearResults");
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
                        <Box sx={panelOneCSS} alignItems="columns">
                            <Typography>Filter by Operator Name:{" "}</Typography>
                            <Typography>(Use comman separation for multiple values):{" "}</Typography>
                            <TextField
                                variant="outlined"
                                label="Required"
                                size="small"
                                value={operators}
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
                                value={centers}
                                onChange={(e) => setCenters(e.target.value)}
                            />
                        </Box>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
                                <DemoItem label="Filter by Time: " component="DateRangePicker">
                                    <DateRangePicker
                                        sx={{width:"500px"}}
                                        value={dayRangeValue}
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
                            sx={{ width: "140px" }}
                        >
                            Filter Report
                        </Button>
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
export default DeliverableReports