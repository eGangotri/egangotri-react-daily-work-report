import { Box, Stack, Typography } from "@mui/material";
import React, { useRef, useState } from "react";

import Icon from "components/common/Icons";



const Header = () => {
    return (
        <Box className="flex pb-5">
            <Icon icon="gangotri" height="100px" width="220px" />
            <Typography variant="h3" className="pb-5 pl-5">eGangotri Daily Work Report</Typography>
        </Box>
    )
}
export default Header