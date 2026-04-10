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

export const financeMenu = {
  label: "Finance",
  icon: Wallet,
  module: "FINANCE",
  children: [
    {
      label: "Ledgers",
      link: "/ledgers",
      icon: ListChecks,
      pageTitle: "Ledgers",
    },
    {
      label: "Transactions",
      link: "/transactions",
      icon: Receipt,
      pageTitle: "Transactions",
    },
    {
      label: "Parties",
      link: "/parties",
      icon: Users,
      pageTitle: "Parties",
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

export const crmMenu = {
  label: "Leadflow CRM",
  icon: Megaphone,
  module: "CRM",
  children: [
    {
      label: "CRM Dashboard",
      link: "/crm-dashboard",
      icon: LayoutDashboard,
      pageTitle: "CRM Dashboard",
    },
    {
      label: "Leads",
      link: "/leads",
      icon: ClipboardCheck,
      pageTitle: "Leads",
    },
    {
      label: "Upload Leads",
      link: "/leads/upload",
      icon: Send,
      pageTitle: "Upload Leads",
    },
    {
      label: "Pending Leads",
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
  crmMenu,
];

export const telecallerAdminMenu = [
  // 4. Telecaller Admin
  commonMenu,
  venturesMenu,
  telecallerAdministrationMenu,
  mediaMenu,
  siteVisitsMenu,
  crmMenu,
];

export const financeAdminMenu = [
  // 5. Finance Admin
  commonMenu,
  venturesMenu,
  financeMenu,
  mediaMenu,
  siteVisitsMenu,
  crmMenu,
];

export const clientAdminMenu = [
  // Client/Company Admin
  commonMenu,
  venturesMenu,
  financeMenu,
  administrationMenu,
  mediaMenu,
  siteVisitsMenu,
  crmMenu,
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

// ==================== USER-LEVEL MENUS ====================
export const accountsMenu = [
  // Regular Finance User
  commonMenu,
  financeMenu,
];

export const telecallerMenu = [
  // Regular Telecaller User
  commonMenu,
  mediaMenu,
  crmMenu,
  siteVisitsMenu,
];

export const associateMenu = [
  // Regular Associate User
  commonMenu,
  venturesMenu,
  mediaMenu,
  siteVisitsMenu,
  crmMenu,
];

// ==================== HELPER FUNCTION ====================
export const getMenuByRole = (role, userModules = [], userType = "user") => {
  const roleKey = role?.toLowerCase().replace(/_/g, "");
  const uType = (userType || "user").toLowerCase();
  
  // Base menus for each role type
  const baseMenus = {
    // Admins
    admin: adminMenu, // Marketing
    marketingadmin: adminMenu,
    superadmin: superAdminMenu,
    companyadmin: clientAdminMenu,
    clientadmin: clientAdminMenu,

    // Specific Admins vs Users
    telecaller: uType === "admin" ? telecallerAdminMenu : telecallerMenu,
    accounts: uType === "admin" ? financeAdminMenu : accountsMenu,
    finance: uType === "admin" ? financeAdminMenu : accountsMenu,

    // Users
    associate: associateMenu,
    user: associateMenu,
    salesmanager: adminMenu, 
    manager: adminMenu,
    teamlead: associateMenu,
  };

  const menu = baseMenus[roleKey] || (uType === "admin" ? adminMenu : associateMenu);

  // Filter menu based on userModules
  // If userModules is ["ALL"], skip filtering
  if (userModules.includes("ALL")) return menu;

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
