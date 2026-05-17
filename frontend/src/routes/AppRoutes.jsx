import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import RoleProtectedRoute from '../components/auth/RoleProtectedRoute.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import Dashboard from '../pages/employee/Dashboard.jsx';
import CreateGoalSheet from '../pages/employee/CreateGoalSheet.jsx';
import DraftGoals from '../pages/employee/DraftGoals.jsx';
import SubmitGoals from '../pages/employee/SubmitGoals.jsx';
import QuarterlyUpdates from '../pages/employee/QuarterlyUpdates.jsx';
import StatusTracking from '../pages/employee/StatusTracking.jsx';
import GoalHistory from '../pages/employee/GoalHistory.jsx';
import TeamDashboard from '../pages/manager/TeamDashboard.jsx';
import TeamReview from '../pages/manager/TeamReview.jsx';
import GoalApproval from '../pages/manager/GoalApproval.jsx';
import SharedGoalManagement from '../pages/manager/SharedGoalManagement.jsx';
import QuarterlyCheckin from '../pages/manager/QuarterlyCheckin.jsx';
import TeamAnalytics from '../pages/manager/TeamAnalytics.jsx';
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminReports from '../pages/admin/Reports.jsx';
import CycleManagement from '../pages/admin/CycleManagement.jsx';
import UserManagement from '../pages/admin/UserManagement.jsx';
import AuditViewer from '../pages/admin/AuditViewer.jsx';
import ReportCenter from '../pages/admin/ReportCenter.jsx';
import GoalUnlock from '../pages/admin/GoalUnlock.jsx';
import AnalyticsDashboard from '../pages/admin/AnalyticsDashboard.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route element={<RoleProtectedRoute allowedRoles={['employee']} />}>
        <Route path="/employee/create-goal-sheet" element={<CreateGoalSheet />} />
        <Route path="/employee/draft-goals" element={<DraftGoals />} />
        <Route path="/employee/submit-goals" element={<SubmitGoals />} />
        <Route path="/employee/quarterly-updates" element={<QuarterlyUpdates />} />
        <Route path="/employee/status-tracking" element={<StatusTracking />} />
        <Route path="/employee/goal-history" element={<GoalHistory />} />
      </Route>
      <Route element={<RoleProtectedRoute allowedRoles={['manager']} />}>
        <Route path="/manager/dashboard" element={<TeamDashboard />} />
        <Route path="/manager/team-review" element={<TeamReview />} />
        <Route path="/manager/goal-approval" element={<GoalApproval />} />
        <Route path="/manager/shared-goals" element={<SharedGoalManagement />} />
        <Route path="/manager/quarterly-checkin" element={<QuarterlyCheckin />} />
        <Route path="/manager/team-analytics" element={<TeamAnalytics />} />
      </Route>
      <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/cycles" element={<CycleManagement />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="/admin/audit" element={<AuditViewer />} />
        <Route path="/admin/report-center" element={<ReportCenter />} />
        <Route path="/admin/goal-unlock" element={<GoalUnlock />} />
        <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
