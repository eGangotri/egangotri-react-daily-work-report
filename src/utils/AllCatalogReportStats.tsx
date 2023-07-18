import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

import * as GeneralUtils from 'utils/GeneralUtils';

import { CatalogWorkReportType } from 'mirror/catalogWorkReportTypes';
import moment from 'moment';
import { DD_MM_YYYY_FORMAT } from './DailyReportUtil';

export default class AllCatalogReportStats {

    static hasAllRequiredFields(all: CatalogWorkReportType) {
        return all.entryCount === 0 || all.entryCount <= 0 || !all.link || !all.catalogProfile;
    }

    static decorate = (all: CatalogWorkReportType): JSX.Element => {
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
                    Total Items Catalog Count
                    <span style={{ fontWeight: 'bold' }}>  ( {all.entryTo} - ({all.entryFrom}+{all.skipped}) ): {' '} {all.entryCount} </span>
                </Typography>
                <Typography>
                    From Index:{' '}
                    <span style={{ fontWeight: 'bold' }}>{all.entryFrom}</span>{' '}
                </Typography>
                <Typography>
                    To Index:{' '}
                    <span style={{ fontWeight: 'bold' }}> {all.entryTo} </span>
                </Typography>
                <Typography>
                    Skipped:{' '}
                    <span style={{ fontWeight: 'bold' }}> {all.skipped} </span>
                </Typography>
                <Typography component="span">
                    <div><Typography>Link:</Typography></div><span style={{ fontWeight: 'bold' }}> {all.link} </span>
                </Typography>
                <Typography component="span">
                <Typography>Notes:</Typography><span style={{ fontWeight: 'bold' }}> {all.notes || "N/A"} </span>
                </Typography>
            </Stack>
        );
    };

    static toString = (all: CatalogWorkReportType): string => {
        return `Work Status for ${GeneralUtils.capitalize(all.operatorName)} (${all.catalogProfile})
On ${all.timeOfRequest}\n
From Index: ${all.entryFrom} 
To Index: ${all.entryTo}\n
SKipped: ${all.skipped}\n
Catalog Count: ${all.entryCount}\n
Link: ${all.link}\n
Notes: ${all.notes}\n`;
    };

}
