export interface ScanWorkReportType {
    center: string;
    lib: string;
    dateOfReport: Date;
    globalCount: number;
    totalSize: number;
    pdfCount: number;
    timeOfRequest: string;
    notes: string;
    staffName: string;
    pdfs: PdfStat[];
    workFromHome:boollean
}
