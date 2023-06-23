import React from 'react';
import { Box, Typography } from '@mui/material';

import * as GeneralUtils from 'utils/GeneralUtils';

import { CatalogWorkReportType } from 'types/catalogWorkReportTypes';

export default class AllCatalogReportStats {
    title = 'eGangotri Daily Catalog Work Report';
    staffName = '';
    center = "";
    fromIndex = 0;
    toIndex = 0;
    dateOfReport = new Date();
    catalogCount = 0;
    timeOfRequest = '';
    link = '';
    notes = '';

    resetToDefault() {
        this.title = 'eGangotri Daily Work Report';
        this.staffName = ''
        this.center = "";
        this.fromIndex = 0;
        this.toIndex = 0;
        this.dateOfReport = new Date();
        this.catalogCount = 0;
        this.timeOfRequest = '';
        this.link = '';
        this.notes = '';;
    }

    static isEmpty(all: AllCatalogReportStats) {
        return all.catalogCount === 0;
    }

    static decorate = (all: AllCatalogReportStats): JSX.Element => {
        if (AllCatalogReportStats.isEmpty(all)) {
            return <></>;
        }
        return (
            <Box>
                <Typography>
                    Work Status for <span style={{ fontWeight: 'bold' }}>{GeneralUtils.capitalize(all.staffName)} ({all.center})</span> :
                </Typography>
                <Typography>
                    {' '}
                    On <span style={{ fontWeight: 'bold' }}>{all.timeOfRequest}</span>
                </Typography>
                <Typography>
                    {' '}
                    Total Items Catalog Count{' '}
                    <span style={{ fontWeight: 'bold' }}> {all.catalogCount} </span>
                    -               </Typography>
                <Typography>
                    From Index:{' '}
                    <span style={{ fontWeight: 'bold' }}>{all.fromIndex}</span>{' '}
                </Typography>
                <Typography sx={{ paddingBottom: "30px" }}>
                    To Index:{' '}
                    <span style={{ fontWeight: 'bold' }}> {all.toIndex} </span>
                </Typography>
                <Typography component="span">
                    <span style={{ fontWeight: 'bold' }}> {all.link} </span>
                </Typography>
                <Typography component="span">
                    <span style={{ fontWeight: 'bold' }}> {all.notes} </span>
                </Typography>
            </Box>
        );
    };

    static toString = (all: AllCatalogReportStats): string => {
        return `Work Status for ${GeneralUtils.capitalize(all.staffName)} (${all.center})
On ${all.timeOfRequest}\n
From Index: ${all.fromIndex} 
To Index: ${all.toIndex}\n
Catalog Count: ${all.catalogCount}\n
Link: ${all.link}\n
Notes: ${all.notes}\n`;
    };

    static convertCatStatsToCatWorkReportTypeObject = (catRepStatus: AllCatalogReportStats) => {
        const catWorkReportType: CatalogWorkReportType =
        {
            "staffName": catRepStatus.staffName,
            "center": catRepStatus.center,
            "fromIndex": catRepStatus.fromIndex,
            "toIndex": catRepStatus.toIndex,
            "dateOfReport": catRepStatus.dateOfReport,
            "catalogCount": catRepStatus.catalogCount,
            "timeOfRequest": catRepStatus.timeOfRequest,
            "link": catRepStatus.link,
            "notes": catRepStatus.notes
        }
        return catWorkReportType
    }
}
