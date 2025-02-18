import { NavGroup } from "@/types";

export const adminNav: NavGroup[] = [
  {
    title: 'SETTINGS',
    items: [
      {
        title: 'My Account',
        href: '/my-account',
        icon: 'user',
        label: 'my-account',
        subNav: null
 
      },
      {
        title: 'Billings',
        href: '/digital-signage/billings',
        icon: 'billing',
        label: 'billings',
        subNav: null
      },    
      {
        title: 'Withdrawals',
        href: '/digital-signage/withdrawals',
        icon: 'send',
        label: 'withdrawals',
        subNav: null
      },    
      {
        title: 'Subscription Plan',
        href: '/digital-signage/subscription-plans',
        icon: 'subscriptionPlan',
        label: 'subscription-plans',
        subNav: null

      },
      {
        title: 'Users',
        href: '/admin/users',
        icon: 'users',
        label: 'users',
        subNav: null
      }
    ]
  }
];
