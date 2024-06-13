import ProtectedRoute from 'ProtectedRoute';
import CatalogReport from 'pages/CatalogReport';
import DailyReport from 'pages/DailyReport';
import DeliverableReports from 'pages/DeliverableReports';
import GDriveUploadeport from 'pages/GDriveUploadReport';
import GDriveUploadeports from 'pages/GDriveUploadReports';
import QAReport from 'pages/QAReport';
import QAReports from 'pages/QAReports';
import Users from 'pages/Users';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export const LANDING_PAGE_PATH = "/"
export const DELIVERABLE_REPORTS_PATH = "/reports";
export const CATALOG_PATH = "/catalog";
export const QA_PATH = "/qa";
export const QA_REPORTS_METADATA_PATH = "/qaReports";
export const GDRIVE_UPLOAD_PATH = "/gDriveUpload";
export const GDRIVE_UPLOAD_METADATA_PATH = "/gDriveUploadReports";
export const CATALOG_REPORTS_METADATA_PATH = "/catReports";
export const USERS = "/users";

const DWRRoutes: React.FC = () => (
    <Routes>
        <Route path="/test" element={<>TestAreaWithoutLayout</>} />
        <Route element={<ProtectedRoute />}>
            {<Route path={LANDING_PAGE_PATH} element={<DailyReport />} />}
            {<Route path={DELIVERABLE_REPORTS_PATH} element={<DeliverableReports />} />}
            {<Route path={CATALOG_PATH} element={<CatalogReport />} />}
            {<Route path={CATALOG_REPORTS_METADATA_PATH} element={<DeliverableReports />} />}
            {<Route path={QA_PATH} element={<QAReport />} />}
            {<Route path={QA_REPORTS_METADATA_PATH} element={<QAReports />} />}
            {<Route path={GDRIVE_UPLOAD_PATH} element={<GDriveUploadeport />} />}
            {<Route path={GDRIVE_UPLOAD_METADATA_PATH} element={<GDriveUploadeports />} />}
            {<Route path={USERS} element={<Users />} />}
        </Route>
    </Routes>
);

export default DWRRoutes;
