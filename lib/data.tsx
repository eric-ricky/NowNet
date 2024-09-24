import {
  Banknote,
  Home,
  ListChecks,
  MonitorSmartphone,
  Network,
  Wallet,
  Wifi,
} from "lucide-react";

export const sidebarLinks = [
  {
    icon: <Home size={20} />,
    route: "/app",
    label: "Home",
  },
  {
    icon: <MonitorSmartphone size={20} />,
    route: "/app/devices",
    label: "My Devices",
  },
  {
    icon: <ListChecks size={20} />,
    route: "/app/subscriptions",
    label: "Subscriptions",
  },
  {
    icon: <Wallet size={20} />,
    route: "/app/wallet",
    label: "My Wallet",
  },
  {
    icon: <Wifi size={20} />,
    route: "/app/networks",
    label: "My Networks",
  },
  {
    icon: <Banknote size={20} />,
    route: "/app/earnings",
    label: "My Earnings",
  },
];
export const adminSidebarLinks = [
  {
    icon: <Home size={20} />,
    route: "/app/admin",
    label: "Dashboard",
  },
  {
    icon: <Network size={20} />,
    route: "/app/admin/networks",
    label: "Networks",
  },
  {
    icon: <Wallet size={20} />,
    route: "/app/admin/payments",
    label: "Payments",
  },
];

export const containerDivStyles = `max-xl:max-h-screen max-xl::overflow-y-auto !overflow-x-hidden no-scrollbar`;
