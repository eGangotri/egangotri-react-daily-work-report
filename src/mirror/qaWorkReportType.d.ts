export interface QAWorkReportType {
    center: string;
    lib: string;
    dateOfReport: Date;
    folderNames: string;
    pdfsRenamedCount: number;
    coverPagesRenamedCount: number;
    coverPagesMoved:boolean
    timeOfRequest: string;
    notes: string;
    operatorName: string;
}
