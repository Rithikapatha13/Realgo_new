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
  CreditCard,
  FileText,
  Repeat,
  TableProperties,
  CheckCircle2,
  Scale,
  LayoutList,
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
      label: "My Team",
      link: "/my-team",
      icon: UserCheck,
      pageTitle: "My Team",
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
    {
      label: "Project Incentives",
      link: "/project-incentives",
      icon: BadgeIndianRupee,
      pageTitle: "Project Incentives",
      subtitle: "View project commission levels",
    },
  ],
};


export const administrationMenu = {
  label: "Administration",
  icon: User,
  module: "ADMINISTRATION",
  children: [
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
      subtitle: "Manage and view all requests",
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
  children: [
    {
      label: "Site Visits",
      link: "/Sitevisits",
      icon: LayoutDashboard,
      pageTitle: "Site Visits",
      subtitle: "Manage and view all Site visits",
    }
  ],
};

export const financeMenu = {
  label: "Finance",
  icon: Wallet,
  children: [
    {
      label: "Dashboard",
      link: "/finance",
      icon: LayoutDashboard,
      pageTitle: "Finance Dashboard",
      subtitle: "Overview of financial status",
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

// ==================== ROLE-BASED MENUS ====================
export const adminMenu = [
  // 3. Marketing Admin
  commonMenu,
  venturesMenu,
  administrationMenu,
  mediaMenu,
  siteVisitsMenu,
  marketingAdminCrmMenu,
];

export const telecallerAdminMenu = [
  commonMenu,
  venturesMenu,
  administrationMenu,
  mediaMenu,
  siteVisitsMenu,
  telecallerAdminCrmMenu,
];


export const financeAdminMenu = [
  // 5. Finance Admin
  commonMenu,
  venturesMenu,
  administrationMenu,
  financeMenu,
  mediaMenu,
  siteVisitsMenu,
  // No leads menu for finance admin
];

export const clientAdminMenu = [
  // Client/Company Admin
  commonMenu,
  venturesMenu,
  financeMenu,
  administrationMenu,
  mediaMenu,
  siteVisitsMenu,
  clientAdminCrmMenu,
];

export const adminRoleMenu = [
  commonMenu,
  venturesMenu,
  administrationMenu,
  mediaMenu,
  siteVisitsMenu,
  adminCrmMenu,
];


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
    },
    {
      label: "Cheque Series",
      link: "/finance/cheque-series",
      icon: Layers,
      pageTitle: "Cheque Series",
    },
    {
      label: "Account Tree",
      link: "/finance/accounts",
      icon: ListChecks,
      pageTitle: "Account Tree",
    },
    {
      label: "Ledgers",
      link: "/finance/ledgers",
      icon: BookOpen,
      pageTitle: "Ledgers",
    },
    {
      label: "SubLedgers",
      link: "/finance/subledgers",
      icon: List,
      pageTitle: "SubLedgers",
    },
    {
      label: "Parties",
      link: "/finance/parties",
      icon: Users,
      pageTitle: "Parties",
    },
  ]
};

export const financeTransactionMenu = {
  label: "Transaction",
  icon: Repeat,
  module: "FINANCE",
  children: [
    {
      label: "General Receipt",
      link: "/finance/general-receipt",
      icon: Receipt,
      pageTitle: "General Receipt",
    },
    {
      label: "Payment Voucher",
      link: "/finance/payment-voucher",
      icon: CreditCard,
      pageTitle: "Payment Voucher",
    },
    {
      label: "Journal Voucher",
      link: "/finance/journal-voucher",
      icon: FileText,
      pageTitle: "Journal Voucher",
    },
    {
      label: "Transactions",
      link: "/finance/transactions",
      icon: Repeat,
      pageTitle: "Transactions",
    },
    {
      label: "Cheque Detail",
      link: "/finance/cheque-details",
      icon: TableProperties,
      pageTitle: "Cheque Detailed View",
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
    },
    {
      label: "Bank Book",
      link: "/finance/reports/bank-book",
      icon: Landmark,
      pageTitle: "Bank Book",
    },
    {
      label: "Day Book",
      link: "/finance/reports/day-book",
      icon: Calendar,
      pageTitle: "Day Book",
    },
    {
      label: "Account Ledger",
      link: "/finance/reports/account-ledger",
      icon: BookOpen,
      pageTitle: "Account Ledger",
    },
    {
      label: "BRS",
      link: "/finance/reports/brs",
      icon: CheckCircle2,
      pageTitle: "Bank Reconciliation Statement",
    },
    {
      label: "Trail Balance",
      link: "/finance/reports/trial-balance",
      icon: Scale,
      pageTitle: "Trail Balance",
    },
    {
      label: "Profit Loss",
      link: "/finance/reports/profit-loss",
      icon: TrendingUp,
      pageTitle: "Profit & Loss",
    },
    {
      label: "Balance Sheet",
      link: "/finance/reports/balance-sheet",
      icon: LayoutList,
      pageTitle: "Balance Sheet",
    },
  ]
};

// ==================== USER-LEVEL MENUS ====================
export const accountsMenu = [
  commonMenu,
  financeConfigMenu,
  financeTransactionMenu,
  financeReportMenu,
];

export const superAdminMenu = [
  commonMenu,
  venturesMenu,
  administrationMenu,
  mediaMenu,
  siteVisitsMenu,
  systemManagementMenu,
];

export const telecallerMenu = [
  tcGeneralMenu,
  {
    label: "Leads",
    icon: Megaphone,
    module: "CRM",
    children: [
      {
        label: "Dashboard",
        link: "/tc-dash",
        icon: LayoutDashboard,
        pageTitle: "Dashboard",
      },
      {
        label: "My Leads",
        link: "/leads",
        icon: ClipboardCheck,
        pageTitle: "Leads",
      },
      {
        label: "Pending",
        link: "/leads/pending",
        icon: Clock,
        pageTitle: "Pending Leads",
      },
      {
        label: "Follow-ups",
        link: "/leads/followups",
        icon: Calendar,
        pageTitle: "Follow-ups",
      },
      {
        label: "Performance",
        link: "/performance",
        icon: TrendingUp,
        pageTitle: "Performance Tracking",
      },
    ],
  },
];


export const associateMenu = [
  // Associate User — Integrated Leadflow & Realgo experience
  commonMenu,
  leadflowCrmMenu,
  networkMenu,
  venturesMenu,
  mediaMenu,
  {
    label: "Notes",
    link: "/notes",
    icon: NotebookPen,
    pageTitle: "Notes",
  },
  {
    label: "Reminders",
    link: "/reminders",
    icon: Clock,
    pageTitle: "Reminders",
  },
];

// ==================== HELPER FUNCTION ====================
export const getMenuByRole = (role, userModules = [], userType = "user") => {
  const roleKey = (role || "").toLowerCase().replace(/[\s_-]/g, "");
  const uType = (userType || "user").toLowerCase();

  // Base menus for each role type
  const baseMenus = {
    // Admins
    admin: adminRoleMenu, // Admin Specific
    marketingadmin: adminMenu,

    superadmin: superAdminMenu,
    companyadmin: clientAdminMenu,
    clientadmin: clientAdminMenu,

    // Specific Admins vs Users
    telecaller: uType === "admin" ? telecallerAdminMenu : telecallerMenu,
    telecalleradmin: telecallerAdminMenu,
    telecaller_admin: telecallerAdminMenu,


    accounts: uType === "admin" ? financeAdminMenu : accountsMenu,
    finance: uType === "admin" ? financeAdminMenu : accountsMenu,

    // Users / Field Roles
    associate: associateMenu,
    user: associateMenu,
    salesmanager: associateMenu,
    manager: associateMenu,
    teamlead: associateMenu,
    asm: associateMenu,
    rsm: associateMenu,
    marketingadmin: adminMenu,
    telecalleradmin: telecallerAdminMenu,
    financeadmin: financeAdminMenu,
  };

  const menu = baseMenus[roleKey] || (uType === "admin" ? adminMenu : associateMenu);

  // For Field Roles (Associate, Manager, etc.), we bypass strict module filtering
  // to ensure they see the core Leadflow and Network tools as requested.
  const isFieldRole = ["associate", "user", "salesmanager", "manager", "teamlead", "asm", "rsm"].includes(roleKey);
  if (isFieldRole || userModules.includes("ALL")) return menu;

  // Cleanup: Remove any empty strings or nulls from the module array
  const activeModules = (userModules || []).filter(m => m && m.trim() !== "");

  // Migration Fallback: If NO valid modules are defined yet, show everything
  if (activeModules.length === 0) {
    return menu;
  }

  return menu.filter(item => {
    // General and System modules are always allowed
    if (item.module === "GENERAL" || item.module === "SYSTEM") return true;

    // Check if the specific module is enabled for this user's role
    return activeModules.includes(item.module);
  });
};

export default {
  adminMenu,
  superAdminMenu,
  associateMenu,
  getMenuByRole,
};

