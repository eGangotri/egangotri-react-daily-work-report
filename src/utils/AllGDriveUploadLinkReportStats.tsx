import React from 'react';
import { Box, Typography } from '@mui/material';

import * as GeneralUtils from 'utils/GeneralUtils';
import { GDriveUploadWorkReportType } from 'mirror/types';

export default class AllGDriveUploadLinkReportStats {
  static isEmpty(all: GDriveUploadWorkReportType) {
    console.log(`all?.gDriveLinks?.length ${all?.gDriveLinks?.length}`);
    return (all?.gDriveLinks?.length === 0);
  }

  static toString = (all: GDriveUploadWorkReportType): string => {
    return `G Drive Upload Status for ${GeneralUtils.capitalize(all.operatorName)} (${all.center}/${all.lib})
On ${all.timeOfRequest}\n
G-Drive Links pdfs uploaded to: ${all.gDriveLinks} \n
Notes: ${all.notes} 
`;
  };

  static convertStatsToQAReportTypeObject = (qaData: GDriveUploadWorkReportType) => {
    const gDriveUpload: GDriveUploadWorkReportType =
    {
      "operatorName": qaData.operatorName,
      "center": qaData.center,
      "lib": qaData.lib,
      "dateOfReport": qaData.dateOfReport,
      "timeOfRequest": qaData.timeOfRequest,
      "notes": qaData.notes,
      "gDriveLinks": qaData.gDriveLinks,
    }

    return gDriveUpload
  }
}


export const DecorateGDriveWorkReport: React.FC<{ all: GDriveUploadWorkReportType }> = ({ all }) => {
  if (AllGDriveUploadLinkReportStats.isEmpty(all)) {
    return <></>;
  }
  return (
    <Box sx={{ bgcolor: "whitesmoke" }}>
      <Typography>
        Work Status for <span style={{ fontWeight: 'bold' }}>{GeneralUtils.capitalize(all.operatorName)} ({all.center}/{all.lib})</span> :
      </Typography>
      <Typography>
        Notes: <span style={{ fontWeight: 'bold' }}>{all.notes}</span>
      </Typography>
      <Typography>
        {' '}
        On <span style={{ fontWeight: 'bold' }}>{all.timeOfRequest}</span>
      </Typography>
      <Typography>
        Total Google Drvie Links:{' '}
        <span style={{ fontWeight: 'bold' }}>{all.gDriveLinks}</span>{' '}
      </Typography>
    </Box>
  );
};
