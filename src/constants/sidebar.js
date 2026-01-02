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
} from "lucide-react";

// ==================== ADMIN MENU ====================
export const adminMenu = [
  {
    label: "Common",
    icon: UserCircle,
    children: [
      {
        label: "All Students",
        link: "/students",
        icon: User,
        pageTitle: "All Students",
        subtitle: "Manage and view all student records",
      },
      {
        label: "Parents",
        link: "/students/parents",
        icon: Users,
        pageTitle: "Parents",
        subtitle: "View and manage parent information",
      },
      {
        label: "Add Student",
        link: "/students/add",
        icon: UserPlus,
        pageTitle: "Student Registration",
        subtitle: "Complete all steps to register a student",
      },
      {
        label: "Classes & Sections",
        link: "/students/classes",
        icon: BookOpen,
        pageTitle: "Classes & Sections",
        subtitle: "Manage class structure and sections",
      },
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
