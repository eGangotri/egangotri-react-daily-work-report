import React from 'react';
import { Box, Typography } from '@mui/material';

import * as FrontEndBackendCommonCode from 'mirror/FrontEndBackendCommonCode';
import * as GeneralUtils from 'utils/GeneralUtils';

import type PdfStat from '../vo/PdfStat';
import { QAWorkReportType } from 'mirror/qaWorkReportType';

const emptyQAStats = {
  center: "",
  lib: "",
  timeOfRequest: "",
  dateOfReport: new Date(),
  notes: "",
  staffName: "",
  folderNames: "",
  pdfsRenamedCount: 0,
  coverPagesRenamedCount: 0,
  coverPagesMoved: 0
} as QAWorkReportType


export default class AllQAStats {
  static isEmpty(all: QAWorkReportType) {
    return (all.pdfsRenamedCount === 0 ||  all.coverPagesRenamedCount === 0);
  }

  static toString = (all: QAWorkReportType): string => {
    return `Work Status for ${GeneralUtils.capitalize(all.staffName)} (${all.center}/${all.lib})
On ${all.timeOfRequest}\n
Cover Pages Moved?: ${all.coverPagesMoved ? "Yes" : "No"}
Total Pdfs Renamed: ${all.pdfsRenamedCount} 
Total Cps moved: ${all.coverPagesRenamedCount}\n
Foders worked On: ${all.folderNames} \n
Notes: ${all.notes} 
`;
  };

  static convertPdfStatsToDailyWorkReportTypeObject = (qaData: QAWorkReportType) => {
    const dailyQAWorkReport: QAWorkReportType =
    {
      "staffName": qaData.staffName,
      "center": qaData.center,
      "lib": qaData.lib,
      "folderNames": qaData.folderNames,
      "pdfsRenamedCount": qaData.pdfsRenamedCount,
      "timeOfRequest": qaData.timeOfRequest,
      "coverPagesRenamedCount": qaData.coverPagesRenamedCount,
      "dateOfReport": qaData.dateOfReport,
      "notes": qaData.notes,
      "coverPagesMoved": qaData.coverPagesMoved,
    }

    return dailyQAWorkReport
  }
}


export const DecorateWorkReport: React.FC<{ all: QAWorkReportType }> = ({ all }) => {
  if (AllQAStats.isEmpty(all)) {
    return <></>;
  }
  return (
    <Box sx={{bgcolor:"whitesmoke"}}>
      <Typography>
        Work Status for <span style={{ fontWeight: 'bold' }}>{GeneralUtils.capitalize(all.staffName)} ({all.center}/{all.lib})</span> :
      </Typography>
      <Typography>
        Work From Home: <span style={{ fontWeight: 'bold' }}>{all.coverPagesMoved ? "Yes" : "No"}</span>
      </Typography>
      <Typography>
        Notes: <span style={{ fontWeight: 'bold' }}>{all.notes}</span>
      </Typography>
      <Typography>
        {' '}
        On <span style={{ fontWeight: 'bold' }}>{all.timeOfRequest}</span>
      </Typography>
      <Typography>
        {' '}
        Total Pdf Count{' '}
        <span style={{ fontWeight: 'bold' }}> {all.pdfsRenamedCount} </span>
      </Typography>
      <Typography>
        Total Page Count:{' '}
        <span style={{ fontWeight: 'bold' }}>{all.coverPagesRenamedCount}</span>{' '}
      </Typography>
    </Box>
  );
};
