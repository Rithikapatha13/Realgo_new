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
  LayoutDashboard,
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
      link: "/myteam",
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
    }
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
    }
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
      pageTitle: "Admin",
      subtitle: "Administration Dashboard",
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
    }
  ],
};

// ==================== ROLE-BASED MENUS ====================
export const adminMenu = [
  commonMenu,
  venturesMenu,
  administrationMenu,
  mediaMenu,
  siteVisitsMenu,
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

export const accountsMenu = [
  commonMenu,
  financeConfigMenu,
  financeTransactionMenu,
  financeReportMenu,
];

// Cleaned up redundant superAdminMenu definition below

export const superAdminMenu = [
  commonMenu,
  venturesMenu,
  administrationMenu,
  mediaMenu,
  siteVisitsMenu,
  systemManagementMenu,
];

export const associateMenu = [
  commonMenu,
  venturesMenu,
  mediaMenu,
  siteVisitsMenu,
];

// ==================== HELPER FUNCTION ====================
export const getMenuByRole = (role) => {
  const menus = {
    admin: adminMenu,
    superadmin: superAdminMenu,
    accounts: accountsMenu,
    associate: associateMenu,
    user: associateMenu,
  };

  return menus[role?.toLowerCase()] || associateMenu;
};

export default {
  adminMenu,
  superAdminMenu,
  associateMenu,
  getMenuByRole,
};
