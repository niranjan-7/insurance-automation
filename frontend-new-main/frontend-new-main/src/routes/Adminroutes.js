import AdminDashboard from "views/admin/AdminDashboard";
import AdminUserProfile from "views/admin/UserAccess";
import AdminTableList from "views/admin/AdminPolicy";
import AdminTypography from "views/admin/AdminClaims";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: AdminDashboard,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Policies",
    icon: "nc-icon nc-notes",
    component: AdminTableList,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Claims",
    icon: "nc-icon nc-paper-2",
    component: AdminTypography,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "Remove User",
    icon: "nc-icon nc-circle-09",
    component: AdminUserProfile,
    layout: "/admin"
  }
];

export default dashboardRoutes;
