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

// ==================== ADMIN MENU ====================
export const adminMenu = [
  {
    label: "General",
    icon: UserCircle,
    children: [
      {
        label: "Home",
        link: "/",
        icon: LayoutDashboard,
        pageTitle: "Home",
        // subtitle: "Manage and view all student records",
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
  },
   {
    label: "Ventures",
    icon: Landmark,
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
  },
   {
    label: "Administration",
    icon: User,
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
  },
  {
    label: "Media",
    icon: MessageSquare,
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
  },
   {
    label: "Site Visits",
    icon: MapPin,
    children: [
      {
        label: "Site Visits",
        link: "/Sitevisits",
        icon: LayoutDashboard, 
        pageTitle: "Site Visits",
        subtitle: "Manage and view all Site visits", 
      }
    ],
  },
];

// ==================== HELPER FUNCTION ====================
// Get menu based on user role
export const getMenuByRole = (role) => {
  const menus = {
    admin: adminMenu,
  };

  return menus[role.toLowerCase()] || [];
};

// Export default for easy import
export default {
  adminMenu,
  getMenuByRole,
};
