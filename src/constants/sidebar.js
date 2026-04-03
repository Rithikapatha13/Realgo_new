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

export const superAdminMenu = [
  {
    label: "Home",
    link: "/",
    icon: LayoutDashboard,
    pageTitle: "Home",
  },
  {
    label: "Reports",
    link: "/reports",
    icon: BarChart3,
    pageTitle: "Reports",
  },
  {
    label: "Companies",
    link: "/companies",
    icon: Landmark,
    pageTitle: "Companies",
  },
  {
    label: "Profile",
    link: "/profile",
    icon: UserCircle,
    pageTitle: "Profile",
  },
];


export const superAdminCommonMenu = {
  ...commonMenu,
  children: commonMenu.children.filter(child => child.label !== "My Team")
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
  financeMenu,
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

// Cleaned up redundant superAdminMenu definition below

export const superAdminMenu = [
  commonMenu,
  venturesMenu,
  administrationMenu,
  mediaMenu,
  siteVisitsMenu,
  financeMenu,
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
