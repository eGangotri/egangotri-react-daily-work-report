import React, { useState } from "react";
import { Box, Stack, TextField, Typography } from "@mui/material";
import {
    useRecoilState,
} from 'recoil';
import { loggedInState, loggedUser } from "pages/Dashboard";
import LoginPanel from "pages/LoginPanel";
import { panelOneCSS } from "pages/constants";

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';


const DeliverableReports = () => {
    const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);

    const [operatorName, setOperatorName] = useState("");
    const [selectedStartDate, setSelectedStartDate] = React.useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(null);

    const handleStartDateChange = (date: any) => {
        setSelectedStartDate(date);
    };

    const handleEndDateChange = (date: any) => {
        setSelectedEndDate(date);
    };

    const [value, setValue] = React.useState<DateRange<Dayjs>>([
        dayjs(new Date()),
        dayjs(new Date()),
    ]);

    const onDatePickerChange = (newValue:DateRange<Dayjs>) => {
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
                {!_isLoggedIn ?
                    <><Box sx={panelOneCSS}>
                        Filter by Operator Name:{" "}
                        <TextField
                            variant="outlined"
                            label="Required"
                            size="small"
                            onChange={(e) => setOperatorName(e.target.value)}
                        />
                    </Box>
                        <Box sx={panelOneCSS}>
                            Filter by Time:{" "}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
                                    <DemoItem label="Specify Work Range" component="DateRangePicker">
                                        <DateRangePicker
                                            value={value}
                                            onChange={(newValue:DateRange<Dayjs>) => onDatePickerChange(newValue)}
                                        />
                                    </DemoItem>
                                </DemoContainer>
                            </LocalizationProvider>
                        </Box>
                    </>
                    :
                    <></>}
            </Box>
        </Stack>
    )
}
export default DeliverableReports