import React from "react";
import { Grid, Typography } from "@mui/material";

import Icon from "components/common/Icons";

const Header = () => {
    return (
        <Grid container alignItems="center" spacing={2} className="pb-5 sm:pb-3">
        <Grid item sm="auto" className="sm:mb-3">
            <Icon icon="gangotri" height="100px" width="220px" />
        </Grid>
        <Grid item sm="auto">
            <Typography variant="h3">eGangotri Daily Work Report</Typography>
        </Grid>
    </Grid>
    )
}
export default Header