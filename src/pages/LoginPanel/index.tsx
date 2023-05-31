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
import { loggedInState, loggedUser } from "pages/Dashboard";

const LoginPanel: React.FC = () => {
    const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);

  const [validationMsg, setValidationMsg] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const panelOneCSS = { bgcolor: "white", marginRight: "10px" };

  const loginToPortal = async () => {
    if (JSON.parse(env.REACT_APP_OVER_RIDE_LOGIN)) {
        setIsLoggedIn(true);
    }
    else {
      const logIn: boolean = await HelperService.logIn(_loggedUser, password);
      setIsLoggedIn(logIn);
      setValidationMsg(!logIn);
    }
  };

  return (
    <Stack spacing={2}>
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
