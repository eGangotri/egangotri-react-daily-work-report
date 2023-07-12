import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

import * as GeneralUtils from 'utils/GeneralUtils';

import { AllCatalogReportStatsInterface } from 'types/catalogWorkReportTypes';
import moment from 'moment';
import { DD_MM_YYYY_FORMAT } from './DailyReportUtil';

export default class AllCatalogReportStats {

    static hasAllRequiredFields(all: AllCatalogReportStatsInterface) {
        return all.entryCount === 0 || all.entryCount <=0 || !all.link || !all.catalogProfile;
    }

    static decorate = (all: AllCatalogReportStatsInterface): JSX.Element => {
        if (AllCatalogReportStats.hasAllRequiredFields(all)) {
            return <></>;
        }
        return (
            <Stack spacing={2}>
                <Typography>
                    Work Status for <span style={{ fontWeight: 'bold' }}>{GeneralUtils.capitalize(all.operatorName)} ({all.catalogProfile})</span> :
                </Typography>
                <Typography>
                    {' '}
                    On <span style={{ fontWeight: 'bold' }}>{moment(all.timeOfRequest).format(DD_MM_YYYY_FORMAT)}</span>
                </Typography>
                <Typography>
                    {' '}
                    Total Items Catalog Count{' '}
                    <span style={{ fontWeight: 'bold' }}> {all.entryCount} </span>
                </Typography>
                <Typography>
                    From Index:{' '}
                    <span style={{ fontWeight: 'bold' }}>{all.entryFrom}</span>{' '}
                </Typography>
                <Typography sx={{ paddingBottom: "30px" }}>
                    To Index:{' '}
                    <span style={{ fontWeight: 'bold' }}> {all.entryTo} </span>
                </Typography>
                <Typography component="span">
                    <span style={{ fontWeight: 'bold' }}> {all.link} </span>
                </Typography>
                <Typography component="span">
                    <span style={{ fontWeight: 'bold' }}> {all.notes} </span>
                </Typography>
            </Stack>
        );
    };

    static toString = (all: AllCatalogReportStatsInterface): string => {
        return `Work Status for ${GeneralUtils.capitalize(all.operatorName)} (${all.catalogProfile})
On ${all.timeOfRequest}\n
From Index: ${all.entryFrom} 
To Index: ${all.entryTo}\n
Catalog Count: ${all.entryCount}\n
Link: ${all.link}\n
Notes: ${all.notes}\n`;
    };

}
