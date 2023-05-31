import { Box, Stack, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import {
    useRecoilState,
} from 'recoil'
import { loggedInState, loggedUser } from "pages/Dashboard";
import LoginPanel from "pages/LoginPanel";


const DeliverableReports = () => {
    const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
    return (
        <Stack spacing={2}>
            <Box>
                <LoginPanel />
            </Box>
            <Typography variant="h3" >Under Devlopment</Typography>
        </Stack>
    )
}
export default DeliverableReports