import React from 'react';
import { Box, Typography } from '@mui/material';

import * as GeneralUtils from 'utils/GeneralUtils';
import { GDriveUploadWorkReportType } from 'mirror/types';
import { CHOOSE_CENTER } from 'service/CentersService';

export default class AllGDriveUploadLinkReportStats {
  static isValidGDriveUploadReport(all: GDriveUploadWorkReportType) {
    const centerChosen = (all.center?.length > 0 && CHOOSE_CENTER !== all.center)
    const gDriveLinksPresent = (all?.gDriveLinks?.length > 0)
    const startsWithClause =  all?.gDriveLinks?.every((link) => link.startsWith("https://drive.google.com/"))
    return ( centerChosen && gDriveLinksPresent && startsWithClause);
  }


  static toString = (all: GDriveUploadWorkReportType): string => {
    return `Google Drive Upload Status for ${GeneralUtils.capitalize(all.operatorName)} (${all.center}/${all.lib})
On ${all.timeOfRequest}\n
G-Drive Links pdfs uploaded to: ${all.gDriveLinks.map((x)=>{
  return `Link: ${x}\n`
})} \n
Pdf Count: ${all.pdfCount} 
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
      "pdfCount": qaData.pdfCount,
      "notes": qaData.notes,
      "gDriveLinks": qaData.gDriveLinks,
    }

    return gDriveUpload
  }
}

export const DecorateGDriveWorkReport: React.FC<{ all: GDriveUploadWorkReportType }> = ({ all }) => {
  if (!AllGDriveUploadLinkReportStats.isValidGDriveUploadReport(all)) {
    return <></>;
  }
  return (
    <Box sx={{ bgcolor: "whitesmoke" }}>
      <Typography>
        G-Drive Upload Status for <span style={{ fontWeight: 'bold' }}>{GeneralUtils.capitalize(all.operatorName)} ({all.center}/{all.lib})</span> :
      </Typography>
      <Typography>
        {' '}
        On <span style={{ fontWeight: 'bold' }}>{all.timeOfRequest}</span>
      </Typography>
      <Typography>
        All Google Drive Links:{' '}
        <span style={{ fontWeight: 'bold' }}>
          <ul>{all.gDriveLinks.map(x => {
            return (
              <li> <a href={x} target="_blank">{x}</a></li>
            )
          })}
          </ul>
        </span>{' '}
      </Typography>
      
      <Typography>
        Pdf-Count: <span style={{ fontWeight: 'bold' }}>{all.pdfCount}</span>
      </Typography>
      
      <Typography>
        Notes: <span style={{ fontWeight: 'bold' }}>{all.notes}</span>
      </Typography>
    </Box>
  );
};
