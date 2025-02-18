import { NavGroup } from "@/types";

export const onlineMarketingNav: NavGroup[] = [
  {
    title: 'Online Marketing',
    items: [
      {
        title: 'Dashboard',
        href: '/online-marketing/dashboard',
        icon: 'dashboard',
        label: 'Dashboard',
        subNav: null
      },
      {
        title: 'Text Alert',
        href: '/online-marketing/text-alert',
        icon: 'text',
        label: 'Text Alert',
        subNav: null
      },
      {
        title: 'Email Alert',
        href: '/online-marketing/email-alert',
        icon: 'email',
        label: 'Email Alert',
        subNav: null
      },
      {
        title: 'Loyalty',
        href: '/online-marketing/loyalty',
        icon: 'loyalty',
        label: 'Loyalty',
        subNav: null
      },
      {
        title: 'Reports',
        href: '/online-marketing/reports',
        icon: 'note',
        label: 'Reports',
        subNav: null
      }
    ]
  }
];
