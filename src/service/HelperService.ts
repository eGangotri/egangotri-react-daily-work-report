import { checkValidCredentials } from 'api/service/DailyReportService';
import { ScanWorkReportType } from 'mirror/scanWorkReportType';
import { PDFDocument } from 'pdf-lib';
import { LoginProps } from 'types/dailyWorkReportTypes';
import * as DailyReportUtil from 'utils/DailyReportUtil';
import AllPdfStats from 'utils/AllScanReportStats';
import type PdfStat from 'vo/PdfStat';

export class HelperService {
  static processFiles = async (files: File[], operatorName: string, 
    center: string, lib: string, 
    notes: string,
    workFromHome:boolean) => {
    const pdfStats = await this.createData(files);
    return this.processData(pdfStats, operatorName, center, lib, notes,workFromHome);
  };

  static createData = async (files: File[]) => {
    const promises: Promise<PdfStat>[] = [];
    files.forEach((file: File) => {
      promises.push(this.fetchPdfStats(file));
    });

    const data = await Promise.all(promises);
    return data;
  };

  static processData(pdfStats: PdfStat[], operatorName: string, center: string, lib: string,
     notes: string,
     workFromHome:boolean) {
    const allPdfStats: ScanWorkReportType = {
      pdfCount: pdfStats.length,
      center: center,
      lib: lib,
      notes: notes,
      timeOfRequest: new Date().toDateString(),
      dateOfReport: new Date(),
      globalCount: DailyReportUtil.aggregate(
        pdfStats.map((x) => x.pageCount)
      ),
      totalSize: DailyReportUtil.aggregate(
        pdfStats.map((x) => x.pdfSize)
      ),
      operatorName: operatorName,
      pdfs: pdfStats,
      workFromHome:workFromHome
    }
    return allPdfStats;
  }

  static fetchPdfStats = async (file: File): Promise<PdfStat> => {
    const buffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer, {
      ignoreEncryption: true,
    });

    const pageCount = pdfDoc.getPageCount();
    const pdfSize = file.size;

    const row: PdfStat = {
      name: file.name,
      pageCount,
      pdfSize,
    };
    return row;
  };

  static logIn = async (operatorName: string, password: string): Promise<LoginProps> => {
    return await checkValidCredentials(operatorName, password);
  }
}

export default HelperService;
