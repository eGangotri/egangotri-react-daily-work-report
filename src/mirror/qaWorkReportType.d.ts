export interface QAWorkReportType {
    center: string;
    lib: string;
    dateOfReport: Date;
    folderNames: string;
    pdfsRenamedCount: number;
    coverPagesRenamedCount: number;
    coverPagesMoved:boollean
    timeOfRequest: string;
    notes: string;
    staffName: string;
}
