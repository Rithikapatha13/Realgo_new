import Signup from "../pages/auth/Signup";
import Roles from "../pages/administration/Roles";
import Home from "../pages/General/Home";
import Profile from "../pages/General/Profile";
import MyTeam from "../pages/General/MyTeam";
import TeamTree from "../pages/General/TeamTree";
import Users from "./../pages/administration/Users";
import Admin from "./../pages/administration/Admin";
import Reports from "./../pages/General/Reports";

import UserReport from "./../pages/Reports/UserReport";
import CompanyUsersReport from "./../pages/Reports/CompanyUsersReport";
import PlotsReport from "./../pages/Reports/PlotsReport";
import SalesReport from "./../pages/Reports/SalesReport";

import Greetings from "./../pages/Media/Greetings";
import News from "./../pages/Media/News";
import Showcase from "./../pages/Media/Showcase";
import Videos from "./../pages/Media/Videos";
import PortraitVideos from "./../pages/Media/PortraitVideos";
import Requests from "./../pages/administration/Requests";
import SiteVisits from "../pages/Site/Sitevisits";
import Plots from "./../pages/Ventures/Plots";
import Projects from "./../pages/Ventures/Projects";
import Notifications from "../pages/Notifications/Notifications";
import Login from "../pages/auth/Login";
import Companies from "../pages/SuperAdmin/Companies";
import SystemDashboard from "../pages/SuperAdmin/SystemDashboard";
import CompanyDetails from "../pages/SuperAdmin/CompanyDetails";
import Accounts from "../pages/Finance/Accounts";
import Ledgers from "../pages/Finance/Ledgers";
import Parties from "../pages/Finance/Parties";
import Transactions from "../pages/Finance/Transactions";
import FinanceReports from "../pages/Finance/FinanceReports";
import GeneralReceipt from "../pages/Finance/GeneralReceipt";
import PaymentVoucher from "../pages/Finance/PaymentVoucher";
import JournalVoucher from "../pages/Finance/JournalVoucher";
import BankConfig from "../pages/Finance/BankConfig";
import ChequeSeriesConfig from "../pages/Finance/ChequeSeriesConfig";
import CashBook from "../pages/Finance/CashBook";
import BankBook from "../pages/Finance/BankBook";
import DayBook from "../pages/Finance/DayBook";
import BRS from "../pages/Finance/BRS";
import FinanceHome from "../pages/Finance/FinanceHome";


export const publicRoutes = {
  auth: {
    basePath: "",
    routes: [{ path: "signup", component: Signup },
    { path: "login", component: Login }
    ],
  },
};

export const routeConfig = {
  General: {
    basePath: "/",
    allowedRoles: ["admin", "associate", "superadmin", "accounts"],
    routes: [
      { path: "", component: Home },
      { path: "profile", component: Profile },
      { path: "/users", component: Users },
      { path: "/myteam", component: MyTeam },
      { path: "/team-tree", component: TeamTree },
      { path: "/reports", component: Reports },
      { path: "/reports/users", component: UserReport },
      { path: "/reports/company-users", component: CompanyUsersReport },
      { path: "/reports/plots", component: PlotsReport },
      { path: "/reports/sales", component: SalesReport },
    ],
  },
  Administration: {
    basePath: "/",
    allowedRoles: ["admin", "superadmin", "accounts"],
    routes: [
      { path: "/users", component: Users },
      { path: "/admin", component: Admin },
      { path: "/roles", component: Roles },
      { path: "requests", component: Requests },
    ],
  },
  Media: {
    basePath: "/",
    allowedRoles: ["admin", "associate", "superadmin", "accounts"],
    routes: [
      { path: "/greetings", component: Greetings },
      { path: "/news", component: News },
      { path: "/videos", component: Videos },
      { path: "/portrait-videos", component: PortraitVideos },
      { path: "/showcases", component: Showcase },
    ],
  },
  Site: {
    basePath: "/",
    allowedRoles: ["admin", "associate", "superadmin", "accounts"],
    routes: [{ path: "sitevisits", component: SiteVisits }],
  },
  Ventures: {
    basePath: "/",
    allowedRoles: ["admin", "associate", "superadmin", "accounts"],
    routes: [
      { path: "plots", component: Plots },
      { path: "Projects", component: Projects },
    ],
  },
  Notifications: {
    basePath: "",
    allowedRoles: ["admin", "associate", "superadmin", "accounts"],
    routes: [{ path: "/notifications", component: Notifications }],
  },
  System: {
    basePath: "/",
    allowedRoles: ["superadmin"],
    routes: [
      { path: "companies", component: Companies },
      { path: "companies/:id", component: CompanyDetails },
      { path: "system-dashboard", component: SystemDashboard },
    ]
  },
  Finance: {
    basePath: "/finance",
    allowedRoles: ["accounts", "admin", "superadmin"],
    routes: [
      { path: "", component: FinanceHome },
      { path: "/accounts", component: Accounts },
      { path: "/ledgers", component: Ledgers },
      { path: "/subledgers", component: Ledgers }, // Reusing Ledgers for now or create SubLedgers
      { path: "/parties", component: Parties },
      { path: "/transactions", component: Transactions },
      { path: "/reports", component: FinanceReports },
      { path: "/bank", component: BankConfig },
      { path: "/cheque-series", component: ChequeSeriesConfig },
      { path: "/general-receipt", component: GeneralReceipt },
      { path: "/payment-voucher", component: PaymentVoucher },
      { path: "/journal-voucher", component: JournalVoucher },
      { path: "/cheque-details", component: BRS }, // Reusing BRS or create ChequeDetails
      { path: "/reports/cash-book", component: CashBook },
      { path: "/reports/bank-book", component: BankBook },
      { path: "/reports/day-book", component: DayBook },
      { path: "/reports/brs", component: BRS },
      { path: "/reports/trial-balance", component: FinanceReports },
      { path: "/reports/profit-loss", component: FinanceReports },
      { path: "/reports/balance-sheet", component: FinanceReports },
    ],
  },
};
