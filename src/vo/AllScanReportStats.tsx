import React from 'react';
import { Box, Typography } from '@mui/material';
import DenseTable from 'components/Table';

import * as FrontEndBackendCommonCode from 'mirror/FrontEndBackendCommonCode';
import * as GeneralUtils from 'utils/GeneralUtils';

import type PdfStat from './PdfStat';
import { DailyWorkReportType } from 'types/dailyWorkReportTypes';
import moment from 'moment';
import { ScanWorkReportType } from 'mirror/scanWorkReportType';

export const emptyPdfStats = {
  center: "",
  lib: "",
  globalCount:0,
  totalSize:0,
  pdfCount:0,
  timeOfRequest: "",
  dateOfReport:new Date(),
  notes: "",
  staffName: "",
  pdfs:[],
} as ScanWorkReportType

export default class AllPdfStats {
  static isEmpty(all: ScanWorkReportType) {
    return all.pdfCount === 0;
  }

  static decorate = (all: ScanWorkReportType): JSX.Element => {
    if (AllPdfStats.isEmpty(all)) {
      return <></>;
    }
    return (
      <Box>
        <Typography>
          Work Status for <span style={{ fontWeight: 'bold' }}>{GeneralUtils.capitalize(all.staffName)} ({all.center}/{all.lib})</span> :
        </Typography>
        <Typography>
          Notes: <span  style={{ fontWeight: 'bold' }}>{all.notes}</span>
        </Typography>
        <Typography>
          {' '}
          On <span style={{ fontWeight: 'bold' }}>{all.timeOfRequest}</span>
        </Typography>
        <Typography>
          {' '}
          Total Pdf Count{' '}
          <span style={{ fontWeight: 'bold' }}> {all.pdfCount} </span>
        </Typography>
        <Typography>
          Total Page Count:{' '}
          <span style={{ fontWeight: 'bold' }}>{all.globalCount}</span>{' '}
        </Typography>
        <Typography sx={{paddingBottom:"30px"}}>
          Total Size:{' '}
          <span style={{ fontWeight: 'bold' }}>
            {FrontEndBackendCommonCode.sizeInfo(all.totalSize)}
          </span>
        </Typography>
        <Typography component="span">
          <DenseTable rows={all.pdfs} />
        </Typography>
      </Box>
    );
  };

  static pdfDataArrayToString = (_pdfs: PdfStat[]) => {
    let dataAsString = '';
    _pdfs.forEach((pdfStat: PdfStat, index: number) => {
      dataAsString += this.pdfDataToString(pdfStat, index + 1);
    });
    return dataAsString;
  };

  static pdfDataToString = (pdfStat: PdfStat, index: number) => {
    return `(${index}) ${pdfStat.name}\t ${
      pdfStat.pageCount
    } pages \t ${FrontEndBackendCommonCode.sizeInfo(pdfStat.pdfSize)}\n\n`;
  };
  
  static toString = (all: ScanWorkReportType): string => {
    return `Work Status for ${GeneralUtils.capitalize(all.staffName)} (${all.center}/${all.lib})
On ${all.timeOfRequest}\n
Notes: ${all.notes} 
Total Pdf Count: ${all.pdfCount} 
Total Page Count: ${all.globalCount}\n
Total Size: ${FrontEndBackendCommonCode.sizeInfo(all.totalSize)}\n
${AllPdfStats.pdfDataArrayToString(all.pdfs)}`;
  };

  static convertPdfStatsToDailyWorkReportTypeObject= (pdfData: ScanWorkReportType) => {
    const dailyWorkReport:DailyWorkReportType =
      {
        "operatorName": pdfData.staffName,
        "center": pdfData.center,
        "lib": pdfData.lib,
        "totalPdfCount": pdfData.pdfCount,
        "totalPageCount": pdfData.globalCount,
        "totalSize": FrontEndBackendCommonCode.sizeInfo(pdfData.totalSize),
        "totalSizeRaw": pdfData.totalSize,
        "dateOfReport":  pdfData.dateOfReport,
        "notes":  pdfData.notes,
        pageCountStats:[]
      }

      pdfData.pdfs.forEach( (_pdf:PdfStat)=>{
        dailyWorkReport.pageCountStats.push({
          "fileName": _pdf.name,
          "pageCount": _pdf.pageCount,
          "fileSize": FrontEndBackendCommonCode.sizeInfo(_pdf.pdfSize),
          "fileSizeRaw": _pdf.pdfSize
        })
      })
      return dailyWorkReport
  }
}
