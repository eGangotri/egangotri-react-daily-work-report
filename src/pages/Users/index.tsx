import React, { useState } from "react";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import {
    useRecoilState,
} from 'recoil';
import { loggedInState, loggedUser, loggedUserRole, loggedUserPassword } from "../../index";
import LoginPanel from "pages/LoginPanel";
import { panelOneCSS } from "pages/constants";
import { ADMIN_ROLE, BASIC_ROLE, CATALOGER_ROLE, QA_ROLE, SUPERADMIN_ROLE } from 'mirror/FrontEndBackendCommonConsts'

import { FaRegTrashAlt } from "react-icons/fa";

import _ from "lodash";
import moment from "moment";
import Spinner from "widgets/Spinner";

import {
    Alert,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    Grid
} from "@mui/material";
import { addUserToBackend } from "api/service/UserService";
import { AZUREISH_WHITE, ERROR_RED, SUCCESS_GREEN, WHITE } from "constants/colors";
const Users = () => {
    const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
    const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);
    const [_loggedUserPassword, setLoggedUserPassword] = useRecoilState(loggedUserPassword);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [addUserBackendResponse, setAddUserBackendResponse] = useState<React.ReactNode>(<></>);

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    const addUser = async (aggregations: boolean = false) => {
        const pathname = window.location.pathname
        console.log(`addUser`, window.location.pathname);
        setIsLoading(true);
        if (_loggedUserRole === SUPERADMIN_ROLE) {
            const resp = await addUserToBackend({
                username: user,
                password,
                role,
                superadmin_user: _loggedUser,
                superadmin_password: _loggedUserPassword
            });
            if (resp && resp.error) {
                setAddUserBackendResponse(<Typography sx={{ backgroundColor: ERROR_RED,color: WHITE}}>{resp.error}</Typography>);
            }
            else {
                setAddUserBackendResponse(<Typography sx={{ backgroundColor: SUCCESS_GREEN,color: WHITE }}>Successfully added {user}</Typography>);
            }
        }
        setIsLoading(false);
    }


    const clearResults = () => {
        setPassword("")
        setUser("")
        setRole(roles[0])
    };

    const handleRoleChange = (event: SelectChangeEvent) => {
        const val = event.target.value;
        console.log(`val ${val}`);
        setRole(val);
    };

    const roles = [BASIC_ROLE, CATALOGER_ROLE, QA_ROLE, ADMIN_ROLE]
    const [role, setRole] = React.useState<string>(roles[0]);

    return (
        <Stack spacing={2}>
            {isLoading && <Spinner />}
            <Box>
                <LoginPanel />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                {(_loggedUserRole === SUPERADMIN_ROLE) ?
                    <Stack spacing={2}>
                        <Box>{addUserBackendResponse}</Box>
                        {<Box sx={panelOneCSS} alignItems="columns">
                            <Typography>Username:{" "}</Typography>
                            <TextField
                                variant="outlined"
                                label="Required"
                                size="small"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                            />
                            <Typography>Password:{" "}</Typography>
                            <TextField
                                variant="outlined"
                                label="Required"
                                size="small"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Box sx={{ display: "flex", flexDirection: "row" }}>
                                <Box sx={panelOneCSS}>
                                    <InputLabel id="l1">Profile</InputLabel>
                                </Box>
                                <Box sx={panelOneCSS}>
                                    <Select
                                        labelId="l1"
                                        id="demo-simple-select-standard"
                                        value={role}
                                        onChange={handleRoleChange}
                                        sx={{ minWidth: '200px' }}
                                        disabled={!_isLoggedIn}
                                    >
                                        {roles.map((option: string) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </Box>
                        </Box>}

                        <Box sx={{ margin: '0 20px 0 0' }}>
                            <Button
                                color="primary"
                                variant="contained"
                                component="span"
                                onClick={() => addUser()}
                                sx={{ width: "110px" }}
                            >
                                Add User
                            </Button>
                        </Box>
                        <Button
                            variant="contained"
                            endIcon={<FaRegTrashAlt style={{ color: "primary" }} />}
                            onClick={() => clearResults()}
                            sx={{ width: "110px", textAlign: "left" }}
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
export default Users