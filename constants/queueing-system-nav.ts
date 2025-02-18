import { NavGroup } from "@/types";

export const queueingSystemNav: NavGroup[] = [
  {
    title: 'Queueing System',
    items: [
      {
        title: 'Dashboard',
        href: '/queueing-system/dashboard',
        icon: 'dashboard',
        label: 'Dashboard',
        subNav: null
      },
      {
        title: 'Customer Kiosk',
        href: '/queueing-system/customer-kiosk',
        icon: 'customerKiosk',
        label: 'Customer Kiosk',
        subNav: null
      },
      {
        title: 'Assign TV Screen',
        href: '/queueing-system/assign-tv-screen',
        icon: 'assignTvScreen',
        label: 'Assign TV Screen',
        subNav: null
      },
      {
        title: 'Manage',
        href: '/queueing-system/manage',
        icon: 'manage',
        label: 'Manage',
        subNav: null
      },
      {
        title: 'Reports',
        href: '/queueing-system/reports',
        icon: 'note',
        label: 'Reports',
        subNav: null
      }
    ]
  }
];