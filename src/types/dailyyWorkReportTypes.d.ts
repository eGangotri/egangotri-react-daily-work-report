//repetition of code: use monorepo
export type DailyWorkReportType = {
  operatorName: string;
  center: string;
  lib: string;
  totalPdfCount: number;
  totalPageCount: number;
  totalSize: string;
  totalSizeRaw: number;
  dateOfReport: Date;
  pageCountStats: PageCountStatsType[];
};

export type PageCountStatsType = {
  fileName: string;
  pageCount: number;
  fileSize: string;
  fileSizeRaw: number;
};

export type LoginPanelProps = {
  username: string;
  password: number;
};
