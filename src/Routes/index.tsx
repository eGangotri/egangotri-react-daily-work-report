import ProtectedRoute from 'ProtectedRoute';
import CatalogReport from 'pages/CatalogReport';
import DailyReport from 'pages/DailyReport';
import DeliverableReports from 'pages/DeliverableReports';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export const LANDING_PAGE_PATH = "/"
export const DELIVERABLE_REPORTS_PATH = "/reports";
export const CATALOG_PATH = "/catalog";
export const CATALOG_REPORTS_METADATA_PATH = "/catReports";

const DWRRoutes: React.FC = () => (
    <Routes>
        <Route path="/test" element={<>TestAreaWithoutLayout</>} />
        <Route element={<ProtectedRoute />}>
            {<Route path={LANDING_PAGE_PATH} element={<DailyReport />} />}
            {<Route path={DELIVERABLE_REPORTS_PATH} element={<DeliverableReports />} />}
            {<Route path={CATALOG_PATH} element={<CatalogReport />} />}
            {<Route path={CATALOG_REPORTS_METADATA_PATH} element={<DeliverableReports />} />}
        </Route>
    </Routes>
);

export default DWRRoutes;
