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
  notes: string;
  workFromHome: string;
};

export type PageCountStatsType = {
  fileName: string;
  pageCount: number;
  fileSize: string;
  fileSizeRaw: number;
};


export type LoginUser = {
  username: string,
  password: string
}


export type AddDailyReportResponseType = {
  success?: string;
  error?: string;
  warning?: string;
  //[key: string]: any;
};

export type LoginProps = {
  username: string,
  password: string
  success: boolean;
  role: string;
};



