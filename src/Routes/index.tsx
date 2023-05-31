import ProtectedRoute from 'ProtectedRoute';
import DailyReport from 'pages/DailyReport';
import DeliverableReports from 'pages/DeliverableReports';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const LANDING_PAGE = "/"
const DELIVERABLE_REPORTS = "/reports";

const DWRRoutes: React.FC = () => (
    <Routes>
        <Route path="/test" element={<>TestAreaWithoutLayout</>} />
        <Route element={<ProtectedRoute />}>
            {<Route path={LANDING_PAGE} element={<DailyReport />} />}
            {<Route path={DELIVERABLE_REPORTS} element={<DeliverableReports />} />}
        </Route>
    </Routes>
);

export default DWRRoutes;
