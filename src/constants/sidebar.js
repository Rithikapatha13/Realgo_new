import {
  BookOpen,
  Users,
  MessageSquare,
  UserCircle,
  ClipboardCheck,
  TrendingUp,
  BookMarked,
  FileCheck,
  Wallet,
  FileUp,
  Bell,
  BadgeIndianRupee,
  Network,
  LayoutDashboard,
  NotebookPen,
  Mail,
  Send,
  CalendarDays,
  Activity,
  Smile,
  GraduationCap,
  UserCheck,
  BarChart3,
  Settings,
  Calendar,
  Award,
  DollarSign,
  Receipt,
  Clock,
  ListChecks,
  CreditCard,
  History,
  Truck,
  Car,
  Megaphone,
  UserPlus,
  BookOpenCheck,
  Baby,
  User,
  MapPinOffIcon,
  LandPlotIcon,
  Landmark,
  MapPin,
  Globe,
  Camera,
  Layers,
  List,
  FileText,
  Repeat,
  TableProperties,
  CheckCircle2,
  Scale,
  LayoutList,
  Briefcase,
  ShieldCheck,
  ImageIcon,
  PlaySquare,
  Lock,
} from "lucide-react";
import { GiVideoCamera } from "react-icons/gi";

// ==================== COMMON MENU ITEMS ====================
export const commonMenu = {
  label: "General",
  icon: UserCircle,
  module: "GENERAL",
  children: [
    {
      label: "Home",
      link: "/",
      icon: LayoutDashboard,
      pageTitle: "Home",
    },
    {
      label: "Profile",
      link: "/profile",
      icon: Users,
      pageTitle: "Profile",
      subtitle: "View and edit your profile information",
    },
    {
      label: "My Team",
      link: "/my-team",
      icon: UserCheck,
      pageTitle: "My Team",
      subtitle: "Manage your team members",
    },
    {
      label: "Reports",
      link: "/reports",
      icon: BarChart3,
      pageTitle: "Reports",
      subtitle: "Generate and view various reports",
    },
    {
      label: "Performance",
      link: "/performance",
      icon: TrendingUp,
      pageTitle: "Performance Tracking",
      subtitle: "Track module-wise performance metrics",
    }
  ],
};

export const tcGeneralMenu = {
  label: "General",
  icon: UserCircle,
  module: "GENERAL",
  children: [
    {
      label: "Home",
      link: "/",
      icon: LayoutDashboard,
      pageTitle: "Home",
    },
    {
      label: "Profile",
      link: "/profile",
      icon: UserCircle,
      pageTitle: "Profile",
    },
    {
      label: "Reports",
      link: "/reports",
      icon: BarChart3,
      pageTitle: "Reports",
    },
  ],
};




// ==================== MODULE GROUPS ====================
export const venturesMenu = {
  label: "Ventures",
  icon: Landmark,
  module: "VENTURES",
  children: [
    {
      label: "Projects",
      link: "/projects",
      icon: LayoutDashboard,
      pageTitle: "Projects",
      subtitle: "Manage and view all projects",
    },
    {
      label: "Plots",
      link: "/plots",
      icon: MapPin,
      pageTitle: "Plots",
      subtitle: "Manage and view all plots",
    },
  ],
};


export const administrationMenu = {
  label: "Administration",
  icon: User,
  module: "ADMIN",
  children: [
    {
      label: "Admins",
      link: "/administration/admins",
      icon: ShieldCheck,
      pageTitle: "Administrative Staff",
      subtitle: "Manage admins and module heads",
    },
    {
      label: "Admin",
      link: "/admin",
      icon: UserPlus,
      pageTitle: "Client Administration",
      subtitle: "Client Administration Dashboard",
    },
    {
      label: "Requests",
      link: "/requests",
      icon: LayoutDashboard,
      pageTitle: "Requests",
      subtitle: "Review and manage administrative requests",
    },
    {
      label: "Roles",
      link: "/roles",
      icon: UserCircle,
      pageTitle: "Roles",
      subtitle: "Manage and view all roles",
    },
    {
      label: "Users",
      link: "/users",
      icon: Users,
      pageTitle: "Users",
      subtitle: "Manage and view all users",
    }
  ],
};

export const mediaMenu = {
  label: "Media",
  icon: MessageSquare,
  module: "MEDIA",
  children: [
    {
      label: "Greetings",
      link: "/greetings",
      icon: Smile,
      pageTitle: "Greetings",
      subtitle: "Manage and view all greetings",
    },
    {
      label: "News",
      link: "/news",
      icon: Globe,
      pageTitle: "News",
      subtitle: "Manage and view all news",
    },
    {
      label: "Videos",
      link: "/videos",
      icon: Camera,
      pageTitle: "Videos",
      subtitle: "Manage and view all videos",
    },
    {
      label: "Showcases",
      link: "/showcases",
      icon: BookOpenCheck,
      pageTitle: "Showcases",
      subtitle: "Manage and view all showcases",
    }
  ],
};

export const siteVisitsMenu = {
  label: "Site Visits",
  icon: MapPin,
  module: "SITE_VISITS",
  link: "/site/dashboard",
  pageTitle: "Site Visits",
  subtitle: "Manage requests and logistics",
};

export const financeMenu = {
  label: "Finance",
  icon: Wallet,
  module: "FINANCE",
  children: [
    {
      label: "Project Incentives",
      link: "/project-incentives",
      icon: BadgeIndianRupee,
      pageTitle: "Project Incentives",
      subtitle: "View project commission levels",
    },
    {
      label: "Dashboard",
      link: "/finance",
      icon: LayoutDashboard,
      pageTitle: "Finance Dashboard",
      subtitle: "Overview of financial status",
    },
    {
      label: "Contributions",
      link: "/associate-contribution",
      icon: BadgeIndianRupee,
      pageTitle: "Associate Contributions",
      subtitle: "Track plot-based commissions",
    },
    {
      label: "Expenses",
      link: "/associate-expense",
      icon: Receipt,
      pageTitle: "Associate Expenses",
      subtitle: "Manage reimbursements",
    },
    {
      label: "Payouts",
      link: "/associate-payout",
      icon: CreditCard,
      pageTitle: "Associate Payouts",
      subtitle: "Record actual payments",
    },
    {
      label: "Audit Logs",
      link: "/finance/audit-logs",
      icon: History,
      pageTitle: "Finance Audit Logs",
      subtitle: "Monitor financial activities",
    },
    {
      label: "Account Tree",
      link: "/finance/accounts",
      icon: ListChecks,
      pageTitle: "Account Tree",
      subtitle: "Manage Chart of Accounts",
    },
    {
      label: "Ledgers",
      link: "/finance/ledgers",
      icon: BookOpen,
      pageTitle: "Ledgers",
      subtitle: "Manage Ledger Accounts",
    },
    {
      label: "Parties",
      link: "/finance/parties",
      icon: Users,
      pageTitle: "Parties",
      subtitle: "Manage Vendors and Customers",
    },
    {
      label: "Transactions",
      link: "/finance/transactions",
      icon: Receipt,
      pageTitle: "Transactions",
      subtitle: "View and Manage Transactions",
    },
    {
      label: "Financial Reports",
      link: "/finance/reports",
      icon: BarChart3,
      pageTitle: "Financial Reports",
      subtitle: "View various financial statements",
    },
  ],
};

export const crmMenu = {
  label: "Leads",
  icon: Megaphone,
  module: "CRM",
  children: [
    { label: "Dashboard", link: "/crm-dashboard", icon: LayoutDashboard, pageTitle: "Dashboard" },
    { label: "Leads", link: "/leads", icon: ClipboardCheck, pageTitle: "Leads" },
    { label: "Upload Leads", link: "/leads/upload", icon: Send, pageTitle: "Upload Leads" },
    { label: "Pending Leads", link: "/leads/pending", icon: Clock, pageTitle: "Pending Leads" },
    { label: "Follow-ups", link: "/leads/followups", icon: Calendar, pageTitle: "Follow-ups" },
  ],
};

// --- Role Specific CRM Menus ---
export const clientAdminCrmMenu = {
  label: "Leads",
  icon: Megaphone,
  module: "CRM",
  children: [
    { label: "CRM Dashboard", link: "/crm-dashboard", icon: LayoutDashboard, pageTitle: "CRM Dashboard" },
    { label: "Leads", link: "/leads", icon: ClipboardCheck, pageTitle: "Leads" },
    { label: "Pending Leads", link: "/leads/pending", icon: Clock, pageTitle: "Pending Leads" },
  ],
};

export const marketingAdminCrmMenu = {
  label: "Leads",
  icon: Megaphone,
  module: "CRM",
  children: [
    { label: "Leads", link: "/leads", icon: ClipboardCheck, pageTitle: "Leads" },
  ],
};

export const telecallerAdminCrmMenu = {
  label: "Leads",
  icon: Megaphone,
  module: "CRM",
  children: [
    { label: "Dashboard", link: "/crm-dashboard", icon: LayoutDashboard, pageTitle: "Dashboard" },
    { label: "Leads", link: "/leads", icon: ClipboardCheck, pageTitle: "Leads" },
    { label: "Upload Leads", link: "/leads/upload", icon: Send, pageTitle: "Upload Leads" },
    { label: "Pending Leads", link: "/leads/pending", icon: Clock, pageTitle: "Pending Leads" },
    { label: "Follow-ups", link: "/leads/followups", icon: Calendar, pageTitle: "Follow-ups" },
  ],
};

export const leadflowCrmMenu = {
  label: "Leads",
  icon: Megaphone,
  module: "CRM",
  children: [
    { label: "Dashboard", link: "/associate-dash", icon: LayoutDashboard, pageTitle: "Dashboard" },
    { label: "My Leads", link: "/leads", icon: ClipboardCheck, pageTitle: "My Leads" },
    { label: "Pending Leads", link: "/leads/pending", icon: Clock, pageTitle: "Pending Leads" },
    { label: "Follow-ups", link: "/leads/followups", icon: Calendar, pageTitle: "Follow-ups" },
  ],
};

export const networkMenu = {
  label: "My Network",
  icon: Network,
  module: "NETWORK",
  children: [
    { label: "Team Tree", link: "/tree", icon: Network, pageTitle: "Organizational Tree" },
    { label: "My Team", link: "/my-team", icon: Users, pageTitle: "My Team" },
    { label: "Site Visits", link: "/customer-sitevisits", icon: MapPin, pageTitle: "Site Visits" },
  ],
};

export const adminCrmMenu = {
  label: "Leads",
  icon: Megaphone,
  module: "CRM",
  children: [
    {
      label: "Leads",
      link: "/leads",
      icon: ClipboardCheck,
      pageTitle: "Leads",
    },
    {
      label: "Follow-ups",
      link: "/leads/followups",
      icon: Calendar,
      pageTitle: "Follow-ups",
    },

  ],
};


// ==================== CUSTOM ADMIN MENUS ====================
export const telecallerAdministrationMenu = {
  label: "Administration",
  icon: User,
  module: "ADMINISTRATION",
  children: [
    {
      label: "Users",
      link: "/users",
      icon: Users,
      pageTitle: "Users",
      subtitle: "Manage and view all users",
    }
  ],
};

export const financeCommonMenu = {
  label: "Common",
  icon: LayoutDashboard,
  module: "GENERAL",
  children: [
    {
      label: "Home",
      link: "/",
      icon: LayoutDashboard,
      pageTitle: "Home",
      module: "GENERAL",
    },
    {
      label: "Profile",
      link: "/profile",
      icon: Users,
      pageTitle: "Profile",
      module: "GENERAL",
    },
    {
      label: "My Team",
      link: "/my-team",
      icon: UserCheck,
      pageTitle: "My Team",
      module: "GENERAL",
    },
    {
      label: "Plots",
      link: "/plots",
      icon: MapPin,
      pageTitle: "Plots Map",
      module: "GENERAL",
    }
  ],
};

export const financeConfigMenu = {
  label: "Configuration",
  icon: Settings,
  module: "FINANCE",
  children: [
    {
      label: "Bank",
      link: "/finance/bank",
      icon: Landmark,
      pageTitle: "Bank Configuration",
      module: "FINANCE",
    },
    {
      label: "Cheque Series",
      link: "/finance/cheque-series",
      icon: Layers,
      pageTitle: "Cheque Series",
      module: "FINANCE",
    },
    {
      label: "Account Tree",
      link: "/finance/accounts",
      icon: ListChecks,
      pageTitle: "Account Tree",
      module: "FINANCE",
    },
    {
      label: "Ledgers",
      link: "/finance/ledgers",
      icon: BookOpen,
      pageTitle: "Ledgers",
      module: "FINANCE",
    },
    {
      label: "SubLedgers",
      link: "/finance/subledgers",
      icon: List,
      pageTitle: "SubLedgers",
      module: "FINANCE",
    },
    {
      label: "Project Incentives",
      link: "/project-incentives",
      icon: BadgeIndianRupee,
      pageTitle: "Project Incentives",
      module: "FINANCE",
    },
    {
      label: "Parties",
      link: "/finance/parties",
      icon: Users,
      pageTitle: "Parties",
      module: "FINANCE",
    },
    {
      label: "Migration",
      link: "/finance/migration",
      icon: FileUp,
      pageTitle: "Account Migration",
      module: "FINANCE",
    },
  ]
};

export const financeTransactionMenu = {
  label: "Transaction",
  icon: Repeat,
  module: "FINANCE",
  children: [
    {
      label: "Transactions",
      link: "/finance/transactions",
      icon: Repeat,
      pageTitle: "Transactions",
      module: "FINANCE",
    },
    {
      label: "General Receipt",
      link: "/finance/general-receipt",
      icon: Receipt,
      pageTitle: "General Receipt",
      module: "FINANCE",
    },
    {
      label: "Payment Voucher",
      link: "/finance/payment-voucher",
      icon: CreditCard,
      pageTitle: "Payment Voucher",
      module: "FINANCE",
    },
    {
      label: "Journal Voucher",
      link: "/finance/journal-voucher",
      icon: FileText,
      pageTitle: "Journal Voucher",
      module: "FINANCE",
    },
    {
      label: "Cheque Detail",
      link: "/finance/cheque-details",
      icon: TableProperties,
      pageTitle: "Cheque Detailed View",
      module: "FINANCE",
    },
  ]
};

export const financeReportMenu = {
  label: "Reports",
  icon: BarChart3,
  module: "FINANCE",
  children: [
    {
      label: "Cash Book",
      link: "/finance/reports/cash-book",
      icon: Wallet,
      pageTitle: "Cash Book",
      module: "FINANCE",
    },
    {
      label: "Bank Book",
      link: "/finance/reports/bank-book",
      icon: Landmark,
      pageTitle: "Bank Book",
      module: "FINANCE",
    },
    {
      label: "Day Book",
      link: "/finance/reports/day-book",
      icon: Calendar,
      pageTitle: "Day Book",
      module: "FINANCE",
    },
    {
      label: "Account Ledger",
      link: "/finance/reports/account-ledger",
      icon: BookOpen,
      pageTitle: "Account Ledger",
      module: "FINANCE",
    },
    {
      label: "BRS",
      link: "/finance/reports/brs",
      icon: CheckCircle2,
      pageTitle: "Bank Reconciliation Statement",
      module: "FINANCE",
    },
    {
      label: "Trail Balance",
      link: "/finance/reports/trial-balance",
      icon: Scale,
      pageTitle: "Trail Balance",
      module: "FINANCE",
    },
    {
      label: "Profit Loss",
      link: "/finance/reports/profit-loss",
      icon: TrendingUp,
      pageTitle: "Profit & Loss",
      module: "FINANCE",
    },
    {
      label: "Balance Sheet",
      link: "/finance/reports/balance-sheet",
      icon: LayoutList,
      pageTitle: "Balance Sheet",
      module: "FINANCE",
    },
  ]
};

export const financeOperationMenu = {
  label: "Accounts",
  icon: BookMarked,
  module: "FINANCE",
  children: [
    {
      label: "Dashboard",
      link: "/finance",
      icon: LayoutDashboard,
      pageTitle: "Finance Dashboard",
      module: "FINANCE",
    },
    {
      label: "Site Visits",
      link: "/site/dashboard",
      icon: MapPin,
      pageTitle: "Site Visit Hub",
      module: "FINANCE",
    },
    {
      label: "Contributions",
      link: "/associate-contribution",
      icon: BadgeIndianRupee,
      pageTitle: "Associate Contributions",
      module: "FINANCE",
    },
    {
      label: "Expenses",
      link: "/associate-expense",
      icon: Receipt,
      pageTitle: "Associate Expenses",
      module: "FINANCE",
    },
    {
      label: "Payouts",
      link: "/associate-payout",
      icon: CreditCard,
      pageTitle: "Associate Payouts",
      module: "FINANCE",
    },
    {
      label: "Audit Logs",
      link: "/finance/audit-logs",
      icon: History,
      pageTitle: "Audit Logs",
      module: "FINANCE",
    },
  ]
};

export const telecallerMenu = [
  { type: "header", label: "Common" },
  { label: "Home", link: "/", icon: LayoutDashboard, pageTitle: "Home", module: "GENERAL" },
  { label: "Profile", link: "/profile", icon: User, pageTitle: "Profile", module: "GENERAL" },

  { type: "header", label: "Leads" },
  { label: "My Leads", link: "/leads", icon: ClipboardCheck, pageTitle: "Leads", module: "CRM" },
  { label: "Pending", link: "/leads/pending", icon: Clock, pageTitle: "Pending Leads", module: "CRM" },
  { label: "Follow-ups", link: "/leads/followups", icon: Calendar, pageTitle: "Follow-ups", module: "CRM" },
  { label: "Site Visits", link: "/customer-sitevisits", icon: MapPin, pageTitle: "Site Visits", module: "SITE_VISITS" },

  { type: "header", label: "Analysis" },
  { label: "Reports", link: "/reports", icon: BarChart3, pageTitle: "Reports", module: "CRM" },

  { type: "header", label: "Media" },
  { label: "News", link: "/news", icon: FileText, pageTitle: "Latest News", module: "MEDIA" },
];

export const accountsMenu = [
  { type: "header", label: "Common" },
  ...financeCommonMenu.children,

  { type: "header", label: "Configuration" },
  ...financeConfigMenu.children,

  { type: "header", label: "Transaction" },
  ...financeTransactionMenu.children,

  { type: "header", label: "Reports" },
  ...financeReportMenu.children,

  { type: "header", label: "Accounts" },
  ...financeOperationMenu.children,
];

// ==================== ROLE-BASED MENUS ====================
// ==================== MARKETING / ADMIN GROUPED MENU ====================
export const adminMenu = [
  { type: "header", label: "Common" },
  { label: "Home", link: "/", icon: LayoutDashboard, pageTitle: "Home", module: "GENERAL" },
  { label: "Profile", link: "/profile", icon: User, pageTitle: "Profile", module: "GENERAL" },
  { label: "My Team", link: "/my-team", icon: Users, pageTitle: "My Team", module: "GENERAL" },

  { type: "header", label: "Analysis" },
  { label: "Performance", link: "/reports", icon: BarChart3, pageTitle: "Performance", module: "GENERAL" },

  { type: "header", label: "Ventures" },
  { label: "Projects", link: "/projects", icon: Briefcase, pageTitle: "Projects", module: "VENTURES" },
  { label: "Phases", link: "/phases", icon: Layers, pageTitle: "Phases", module: "VENTURES" },
  { label: "Plots", link: "/plots", icon: MapPin, pageTitle: "Plots Map", module: "VENTURES" },

  { type: "header", label: "Finance" },
  { label: "Dashboard", link: "/finance", icon: LayoutDashboard, pageTitle: "Finance Dashboard", module: "FINANCE" },
  { label: "Contributions", link: "/associate-contribution", icon: BadgeIndianRupee, pageTitle: "Associate Contributions", module: "FINANCE" },
  { label: "Payouts", link: "/associate-payout", icon: CreditCard, pageTitle: "Associate Payouts", module: "FINANCE" },
  { label: "Reports", link: "/finance/reports", icon: BarChart3, pageTitle: "Financial Reports", module: "FINANCE" },

  { type: "header", label: "Administration" },
  { label: "Users", link: "/users", icon: Users, pageTitle: "Users", module: "ADMIN" },
  { label: "Admins", link: "/administration/admins", icon: ShieldCheck, pageTitle: "Admins", module: "ADMIN" },
  { label: "Roles", link: "/roles", icon: Lock, pageTitle: "Roles", module: "ADMIN" },
  { label: "Requests", link: "/requests", icon: MessageSquare, pageTitle: "Requests", module: "ADMIN" },

  { type: "header", label: "Media" },
  { label: "Greetings", link: "/greetings", icon: ImageIcon, pageTitle: "Greetings", module: "MEDIA" },
  { label: "Showcase", link: "/showcases", icon: ImageIcon, pageTitle: "Showcase", module: "MEDIA" },
  { label: "News", link: "/news", icon: FileText, pageTitle: "News Feed", module: "MEDIA" },
  { label: "Videos", link: "/videos", icon: PlaySquare, pageTitle: "Videos", module: "MEDIA" },

  { type: "header", label: "CRM" },
  { label: "Leads", link: "/leads", icon: ClipboardCheck, pageTitle: "Leads", module: "CRM" },
  { label: "Follow-ups", link: "/leads/followups", icon: Calendar, pageTitle: "Follow-ups", module: "CRM" },
  { label: "Site Visits", link: "/customer-sitevisits", icon: MapPin, pageTitle: "Site Visits", module: "SITE_VISITS" },
];

export const telecallerAdminMenu = [
  ...telecallerMenu,
  { type: "header", label: "Admin Tools" },
  { label: "Users", link: "/users", icon: Users, pageTitle: "Users" },
];

export const financeAdminMenu = [
  // 5. Finance Admin
  ...accountsMenu,
];

export const clientAdminMenu = adminMenu;
export const adminRoleMenu = adminMenu;


export const systemManagementMenu = {
  label: "System",
  icon: Settings,
  module: "SYSTEM",
  children: [
    {
      label: "Companies",
      link: "/companies",
      icon: Landmark,
      pageTitle: "Companies",
      subtitle: "Manage and view all registered companies",
    },
    {
      label: "System Dashboard",
      link: "/system-dashboard",
      icon: Activity,
      pageTitle: "System Dashboard",
      subtitle: "Global overview of the platform",
    }
  ],
};


export const superAdminMenu = [
  commonMenu,
  venturesMenu,
  financeMenu,
  administrationMenu,
  mediaMenu,
  siteVisitsMenu,
  systemManagementMenu,
];

export const associateMenu = [
  { type: "header", label: "Common" },
  { label: "Home", link: "/", icon: LayoutDashboard, pageTitle: "Home", module: "GENERAL" },
  { label: "Profile", link: "/profile", icon: UserCircle, pageTitle: "Profile", module: "GENERAL" },
  { label: "My Team", link: "/my-team", icon: Users, pageTitle: "My Team", module: "GENERAL" },

  { type: "header", label: "CRM" },
  { label: "Dashboard", link: "/associate-dash", icon: LayoutDashboard, pageTitle: "Dashboard", module: "CRM" },
  { label: "My Leads", link: "/leads", icon: ClipboardCheck, pageTitle: "My Leads", module: "CRM" },
  { label: "Pending Leads", link: "/leads/pending", icon: Clock, pageTitle: "Pending Leads", module: "CRM" },
  { label: "Follow-ups", link: "/leads/followups", icon: Calendar, pageTitle: "Follow-ups", module: "CRM" },

  { type: "header", label: "Ventures" },
  { label: "Projects", link: "/projects", icon: Landmark, pageTitle: "Projects", module: "VENTURES" },
  { label: "Plots", link: "/plots", icon: MapPin, pageTitle: "Plots", module: "VENTURES" },

  { type: "header", label: "Media" },
  { label: "Greetings", link: "/greetings", icon: ImageIcon, pageTitle: "Greetings", module: "MEDIA" },
  { label: "News", link: "/news", icon: Globe, pageTitle: "News", module: "MEDIA" },
  { label: "Videos", link: "/videos", icon: Camera, pageTitle: "Videos", module: "MEDIA" },

  { type: "header", label: "Tools" },
  { label: "Notes", link: "/notes", icon: NotebookPen, pageTitle: "Notes", module: "GENERAL" },
  { label: "Reminders", link: "/reminders", icon: Clock, pageTitle: "Reminders", module: "GENERAL" },
];

// ==================== HELPER FUNCTION ====================
export const getMenuByRole = (role, userModules = [], userType = "user") => {
  const roleKey = (role || "").toLowerCase().replace(/[\s_-]/g, "");
  const uType = (userType || "user").toLowerCase();

  // Determine if this is a Marketing Admin (not a full/client admin)
  const isMarketingAdmin = roleKey.includes("marketingadmin") && !roleKey.includes("clientadmin");

  // 1. Identify Archetype based strictly on User Type (Table source)
  let menu = null;

  if (uType === "superadmin") {
    menu = superAdminMenu;
  } else if (roleKey.includes("finance") || roleKey.includes("account")) {
    menu = accountsMenu;
  } else if (roleKey.includes("telecaller")) {
    menu = roleKey.includes("admin") ? telecallerAdminMenu : telecallerMenu;
  } else if (uType === "admin" || roleKey.includes("admin") || roleKey.includes("company")) {
    menu = adminMenu;
  } else {
    menu = associateMenu;
  }

  // Helper to remove empty section headers
  const removeEmptyHeaders = (arr) => arr.filter((item, index, array) => {
    if (item.type === "header") {
      if (index === array.length - 1) return false;
      if (array[index + 1].type === "header") return false;
    }
    return true;
  });

  // 2. Apply hard role-level strips BEFORE any module check
  // Sub-admins (userType === "admin", often used as Marketing Admins) NEVER see Finance
  // Finance is strictly for Client Admin / Super Admin or dedicated Finance roles
  const isFinanceRole = roleKey.includes("finance") || roleKey.includes("account");
  if (uType === "admin" && !isFinanceRole) {
    menu = menu.filter(item => item.module !== "FINANCE");
  }

  // 3. Super Admins bypass module filtering (but still respect role strips above)
  if (uType === "superadmin" || userModules.includes("ALL")) {
    return removeEmptyHeaders(menu);
  }

  // 4. Module-based Gatekeeper filtering for granular access
  const isActuallyAdmin = uType === "admin" || uType === "superadmin" || roleKey.includes("marketingadmin") || roleKey.includes("company");
  const activeModules = (userModules || []).filter(m => m && m.trim() !== "");

  const fallbackFiltered = menu.filter(item => item.type === "header" || ["GENERAL", "SYSTEM", "NETWORK"].includes(item.module));

  // If a company has no modules assigned yet, fallback to basics to prevent lockout
  if (activeModules.length === 0) {
    return removeEmptyHeaders(fallbackFiltered);
  }

  const filtered = menu.filter(item => {
    // Basic types that are always shown
    const itemModule = item.module || "GENERAL";
    if (item.type === "header" || ["GENERAL", "SYSTEM", "NETWORK"].includes(itemModule)) return true;

    // Hard security lock: Non-admins can NEVER see Administration
    if (itemModule === "ADMIN") {
      if (!isActuallyAdmin) return false;
      return activeModules.includes("ADMIN") || activeModules.includes("ROLES") || activeModules.includes("USERS");
    }

    // Hard security lock: Non-admins can ONLY see Projects and Plots in Ventures
    // Ventures are available globally (all modules)
    if (itemModule === "VENTURES") {
      if (!isActuallyAdmin) {
        return item.label.includes("Projects") || item.label.includes("Plots");
      }
      return true;
    }

    // Mapping sidebar groups to actual granular database modules
    switch (itemModule) {
      case "FINANCE":
        return activeModules.includes("FINANCE") || activeModules.includes("ACCOUNTS") || activeModules.includes("PROJECT INCENTIVES");
      case "CRM":
        return activeModules.includes("CRM");
      case "MEDIA":
        return activeModules.includes("MEDIA") || activeModules.includes("NEWS") || activeModules.includes("VIDEOS") || activeModules.includes("GREETINGS") || activeModules.includes("SHOWCASE");
      case "SITE_VISITS":
        return activeModules.includes("SITEVISITS") || activeModules.includes("CUSTOMER SITEVISITS") || activeModules.includes("VEHICLE SITEVISITS");
      default:
        return activeModules.includes(itemModule);
    }
  });

  return removeEmptyHeaders(filtered);
};

export default {
  adminMenu,
  superAdminMenu,
  associateMenu,
  getMenuByRole,
};

