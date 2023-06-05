import { checkValidCredentials } from 'api/service/DailyReportService';
import { PDFDocument } from 'pdf-lib';
import { LoginProps } from 'types/dailyyWorkReportTypes';
import * as DailyReportUtil from 'utils/DailyReportUtil';
import AllPdfStats from 'vo/AllPdfStats';
import type PdfStat from 'vo/PdfStat';

export class HelperService {
  static processFiles = async (files: File[], staffName: string, center: string, lib: string) => {
    const pdfStats = await this.createData(files);
    return this.processData(pdfStats, staffName, center, lib);
  };

  static createData = async (files: File[]) => {
    const promises: Promise<PdfStat>[] = [];
    files.forEach((file: File) => {
      promises.push(this.fetchPdfStats(file));
    });

    const data = await Promise.all(promises);
    return data;
  };

  static processData(pdfStats: PdfStat[], staffName: string, center: string, lib: string) {
    const allPdfStats: AllPdfStats = new AllPdfStats();
    allPdfStats.pdfCount = pdfStats.length;
    allPdfStats.center = center
    allPdfStats.lib = lib
    allPdfStats.timeOfRequest = new Date().toDateString();
    allPdfStats.globalCount = DailyReportUtil.aggregate(
      pdfStats.map((x) => x.pageCount)
    );
    allPdfStats.totalSize = DailyReportUtil.aggregate(
      pdfStats.map((x) => x.pdfSize)
    );
    allPdfStats.staffName = staffName;
    allPdfStats.pdfs = pdfStats;
    return allPdfStats;
  }

  static clipboardResult(allPdfStats: AllPdfStats) {}
  // static clipboardResult = (pdfInfo: PdfInfo) => {
  //   let clipBoardData = `${pdfInfo.stats.header}\n`;
  //   if (pdfInfo.stats.errorMsgs) {
  //     clipBoardData += `${pdfInfo.stats.errorMsgs}\n`;
  //   }
  //   for (let i = 0; i <= pdfInfo.stats.result.length; i++) {
  //     const res = pdfInfo.stats.result[i];
  //     if (res) {
  //       clipBoardData += `${res?.counter} ${res?.name} ${res?.pageCount} ${res?.pdfSize}\n\n`;
  //     }
  //   }
  //   clipBoardData += `Total Page Count: ${pdfInfo.globalCount}`;
  //   clipBoardData += `\nTotal Size: ${FrontEndBackendCommonCode.sizeInfo(
  //     pdfInfo.totalSize
  //   )}`;
  //   return clipBoardData;
  // };

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

  static logIn = async (staffName: string, password: string):Promise<LoginProps>  => {
    return await checkValidCredentials(staffName,password);
  }
}

export default HelperService;
