import env from "react-dotenv";

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Grid,
  FormLabel
} from "@mui/material";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { FiLogIn } from "react-icons/fi";
import HelperService from "service/HelperService";
import {
  useRecoilState,
} from 'recoil';
import { loggedInState, loggedUser, loggedUserRole, loggedUserPassword } from "../../index";

import { LoginProps } from "types/dailyWorkReportTypes";
import { Link } from "react-router-dom";
import { panelOneCSS } from "service/CentersService";
import { BASIC_ROLE, SUPERADMIN_ROLE } from 'mirror/FrontEndBackendCommonConsts'
import { CATALOG_PATH, CATALOG_REPORTS_METADATA_PATH, DELIVERABLE_REPORTS_PATH, GDRIVE_UPLOAD_METADATA_PATH, GDRIVE_UPLOAD_PATH, LANDING_PAGE_PATH, QA_PATH, QA_REPORTS_METADATA_PATH, USERS } from "Routes";
import { FormProvider, useForm } from 'react-hook-form';
import Spinner from "widgets/Spinner";
import { getCentersAndLibraries } from "service/CentersService";

type LoginFormPropsType = {
  username: string;
  password: string;
};

const LoginPanel: React.FC = () => {
  const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
  const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
  const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);
  const [_loggedUserPassword, setLoggedUserPassword] = useRecoilState(loggedUserPassword);

  const [validationMsg, setValidationMsg] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const methods = useForm<LoginFormPropsType>();

  useEffect(() => {
    getCentersAndLibraries();
  });

  const { handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const overrideLogin = import.meta.env.VITE_OVER_RIDE_LOGIN ? JSON.parse(import.meta.env.VITE_OVER_RIDE_LOGIN) : false;
  const logoutCss = {
    ...panelOneCSS,
    display: `${(overrideLogin === true || _isLoggedIn === false) ? "none" : "block"}`
  }

  const onFormSubmit = async (formData: LoginFormPropsType) => {
    console.log(`formData ${JSON.stringify(formData)}`);
    if (overrideLogin === true) {
      setIsLoggedIn(true);
      setLoggedUserRole(BASIC_ROLE);
    }
    else {
      setIsLoading(true);
      const logIn: LoginProps = await HelperService.logIn(formData.username, formData.password);
      console.log(`logIn.success  ${logIn.success} ${typeof logIn.success}`)
      setIsLoggedIn(logIn.success === true);
      setValidationMsg(!logIn.success);
      setLoggedUser(logIn.username)
      setLoggedUserRole(logIn.role);
      setLoggedUserPassword(logIn.password);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setLoggedUser("");
    setLoggedUserRole("");
    setLoggedUserPassword("");
  };


  return (
    <Stack spacing={2}>
      {isLoading && <Spinner text={"Wait atleast 30 seconds"} />}

      <Stack sx={{ display: "flex", flexDirection: "row", fontSize: "30px" }} spacing="2">
        <Box sx={panelOneCSS}><Link to={LANDING_PAGE_PATH}>Home</Link></Box>
        <Box sx={panelOneCSS}><Link to={DELIVERABLE_REPORTS_PATH}>Scanning-Metadata</Link></Box>
        <Box sx={panelOneCSS}><Link to={QA_PATH}>QA-Work</Link></Box>
        <Box sx={panelOneCSS}><Link to={QA_REPORTS_METADATA_PATH}>QA-Work-Metadata</Link></Box>
        <Box sx={panelOneCSS}><Link to={GDRIVE_UPLOAD_PATH}>GDrive Upload-Work</Link></Box>
        <Box sx={panelOneCSS}><Link to={GDRIVE_UPLOAD_METADATA_PATH}>GDrive-Upload-Metadata</Link></Box>
        {/* <Box sx={panelOneCSS}><Link to={CATALOG_PATH}>Catalog-Work</Link></Box>
        <Box sx={panelOneCSS}><Link to={CATALOG_REPORTS_METADATA_PATH}>Catalog-Work-Metadata</Link></Box> */}
        {(_isLoggedIn && _loggedUserRole === SUPERADMIN_ROLE) ? <Box sx={panelOneCSS}><Link to={USERS}>Users</Link></Box> : <></>}
        <Box sx={logoutCss}><a href="#" onClick={() => logout()}>Logout</a></Box>
      </Stack>
      <Box>
        {overrideLogin === true ? <Typography variant="h5">नीचे फिलहाल कोई भी पास्वर्ड डाल दो/Use any password for now</Typography> : <></>}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {_isLoggedIn ?
          <Typography variant="h5">Hi {_.capitalize(_loggedUser)}</Typography> :
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Grid container columns={{ xs: 3, sm: 6, md: 12 }} direction="row" spacing={2}>
                <Grid item xs={1} sm={2} md={3}>
                  <TextField
                    variant="outlined"
                    label="Username"
                    size="small"
                    {...register("username", { required: true })}
                    placeholder="Username"
                    sx={{ paddingRight: "10px" }}
                  />
                </Grid>
                <Grid item xs={1} sm={2} md={3}>
                  <TextField
                    variant="outlined"
                    label="Password"
                    size="small"
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: true })}
                    sx={{ paddingRight: "10px" }}
                  />
                </Grid>
                <Grid item xs={1} sm={2} md={3}>
                  {" "}
                  <FormLabel></FormLabel>
                  <Button
                    color="primary"
                    variant="contained"
                    // sx={{  }}
                    type="submit"
                    sx={{ cursor: "pointer", paddingRight: "10px" }}
                    endIcon={<FiLogIn style={{ color: "primary" }} />}
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
              {validationMsg && <Typography sx={{ color: "red" }}>Login Failure/Wrong UserId or Password</Typography>}
            </form>
          </FormProvider>
        }
      </Box>
    </Stack >
  );
};

export default LoginPanel;
