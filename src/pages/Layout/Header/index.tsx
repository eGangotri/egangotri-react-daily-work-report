import { Box, Stack, Typography } from "@mui/material";
import React, { useRef, useState } from "react";

import Icon from "components/common/Icons";



const Header = () => {
    return (
        <Stack spacing={2}>
            <Typography variant="h3" >eGangotri Daily Work Report</Typography>
            <Box>
                <Icon icon="gangotri" height="300px" width="650px" />
            </Box>
        </Stack>
    )
}
export default Header