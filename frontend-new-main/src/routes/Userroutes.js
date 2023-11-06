import TakePolicy from "views/takePolicy";
import ViewPolicies from "views/viewPolicies";
import ViewPayments from "views/viewPayments";
import Claims from "views/createClaim";
import ViewClaims from 'views/viewClaims';
import Dashboard from 'views/Dashboard';

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-notes",
    component: Dashboard,
    layout: "/dashboard"
  },
  {
    path: "/policies",
    name: "Policies",
    icon: "nc-icon nc-notes",
    component: ViewPolicies,
    layout: "/dashboard"
  },
  {
    path: "/take",
    name: "Take Policy",
    icon: "nc-icon nc-circle-09",
    component: TakePolicy,
    layout: "/dashboard"
  },
  {
    path: "/payments",
    name: "Payments",
    icon: "nc-icon nc-money-coins",
    component: ViewPayments,
    layout: "/dashboard"
  },
  {
    path: "/createclaims",
    name: "Create Claims",
    icon: "nc-icon nc-atom",
    component: Claims,
    layout: "/dashboard"
  },
  {
    path: "/claims",
    name: "My Claims",
    icon: "nc-icon nc-paper-2",
    component: ViewClaims,
    layout: "/dashboard"
  }
];

export default dashboardRoutes;
