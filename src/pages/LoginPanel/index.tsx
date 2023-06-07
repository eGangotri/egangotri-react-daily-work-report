import env from "react-dotenv";

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import _ from "lodash";
import React, { useRef, useState } from "react";
import { FiLogIn } from "react-icons/fi";
import HelperService from "service/HelperService";
import {
    useRecoilState,
    useRecoilValue,
  } from 'recoil'
import { loggedInState, loggedUser,loggedUserRole } from "pages/Dashboard";
import { LoginProps } from "types/dailyyWorkReportTypes";
import { BASIC_ROLE } from "utils/DailyReportUtil";
import { Link } from "react-router-dom";

const LoginPanel: React.FC = () => {
    const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser); 
    const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);

  const [validationMsg, setValidationMsg] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const panelOneCSS = { bgcolor: "white", paddingRight: "10px" };

  const reportsLinkCss = { 
    ...panelOneCSS,
    display: `${_loggedUserRole === "superadmin"?"block":"none"}`
  }

  const logoutCss = { 
    ...panelOneCSS ,
    display: `${(JSON.parse(env.REACT_APP_OVER_RIDE_LOGIN) === true || _isLoggedIn === false ) ?"none":"block"}`
  }

  const logout = async () => {
      setIsLoggedIn(false);
      setLoggedUserRole("");
  };

  const loginToPortal = async () => {
    if (JSON.parse(env.REACT_APP_OVER_RIDE_LOGIN)) {
        setIsLoggedIn(true);
        setLoggedUserRole(BASIC_ROLE);
    }
    else {
      const logIn: LoginProps = await HelperService.logIn(_loggedUser, password);
      console.log( `logIn.success  ${logIn.success } ${typeof logIn.success }`)
      setIsLoggedIn(logIn.success === true);
      setValidationMsg(!logIn.success);
      setLoggedUserRole(logIn.role);
    }
  };
  return (
    <Stack spacing={2}>
      <Stack sx={{display:"flex", flexDirection: "row" }} spacing="2">
        <Box sx={panelOneCSS}><Link to="/">Home</Link></Box>
        <Box sx={reportsLinkCss}><Link to="/reports">Reports</Link></Box>
        <Box sx={logoutCss}><a href="#" onClick={()=> logout()}>Logout</a></Box>
      </Stack>
      <Box>
      {JSON.parse(env.REACT_APP_OVER_RIDE_LOGIN) ? <Typography variant="h5">नीचे फिलहाल कोई भी पास्वर्ड डाल दो/Use any password for now</Typography>:<></>}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {_isLoggedIn ?
          <Typography variant="h5">Hi {_.capitalize(_loggedUser)}</Typography> :
          <>
            <Box sx={panelOneCSS}>
              First Name:{" "}
              <TextField
                variant="outlined"
                label="Required"
                error={_.isEmpty(_loggedUser)}
                size="small"
                onChange={(e) => setLoggedUser(e.target.value)}
              />
            </Box>
            <Box sx={panelOneCSS}>
              Password:{" "}
              <TextField
                variant="outlined"
                label="Required"
                error={_.isEmpty(password)}
                size="small"
                type="password"
                onSubmit={() => loginToPortal()}
                placeholder="Will accept any password for now"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>

            <Box sx={panelOneCSS}>
              <Button
                color="primary"
                variant="contained"
                component="span"
                disabled={(_.isEmpty(_loggedUser) && _.isEmpty(password)) || _isLoggedIn}
                onClick={() => loginToPortal()}
                endIcon={<FiLogIn style={{ color: "primary" }} />}
              >
                Login
              </Button>
            </Box>
            {validationMsg && <Typography sx={{ color: "red" }}>Login Failure/Wrong UserId or Password</Typography>}
          </>
        }
      </Box>
    </Stack>

  );
};

export default LoginPanel;
