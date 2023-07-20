//repetition of code: use monorepo
export interface CatalogWorkReportType {
  operatorName: string;
  catalogProfile: string;
  entryFrom: number;
  entryTo: number;
  skipped: number;
  entryCount: number;
  timeOfRequest: Date;
  link: string;
  notes: string
}

