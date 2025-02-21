import { Icons } from '@/components/icons';
import { NavGroup, NavItem, SidebarNavItem } from '@/types';
import { adminDigitalSignageNav } from './promoters-nav';

import { workplaceNav } from './workplace-nav';
import { adminNav } from './admin-nav';
import { advertisersNav } from './advertisers-nav';

import { onlineMarketingNav } from './online-marketing-nav';
import { queueingSystemNav } from './queueing-system-nav';
import { settingsNav } from './users-nav';

export const getUserNavigations = (session: any) => {
  const roles: any = session?.user?.roles || [];
  const subscriptions: any = session?.user?.subscriptions || [];
  const user_type: string = session?.user?.user_type || '';

  let navigations: any = [];

  // subscriptions are digital_signage, online_marketing, workplace and queueing_system

  if (
    subscriptions.includes('Digital Signage') &&
    user_type.includes('Promoter')
  ) {
    navigations = [...navigations, ...adminDigitalSignageNav];
  }

  if (
    subscriptions.includes('Digital Signage') &&
    user_type.includes('Advertiser')
  ) {
    navigations = [...navigations, ...advertisersNav];
  }

  if (subscriptions.includes('Online Marketing')) {
    navigations = [...navigations, ...onlineMarketingNav];
  }

  if (subscriptions.includes('Work Place')) {
    navigations = [...navigations, ...workplaceNav];
  }

  if (subscriptions.includes('Queueing System')) {
    navigations = [...navigations, ...queueingSystemNav];
  }

  if (roles.includes('Admin')) {
    if (!user_type.includes('Advertiser')) {
      navigations = [...navigations, ...adminNav];
    } else {
      const updatedAdminNav = {
        ...adminNav[0],
        items: adminNav[0].items.slice(0, -3)
      };
      navigations = [...navigations, updatedAdminNav];
    }
  } else {
    navigations = [...navigations, ...settingsNav];
  }

  return navigations;
};

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const nagGroups: NavGroup[] = [
  {
    title: 'DIGITAL SIGNAGE',
    items: [
      {
        title: 'Dashboard',
        href: '/digital-signage/dashboard',
        icon: 'dashboard',
        label: 'Dashboard',
        subNav: null
      },
      {
        title: 'TV Screen',
        href: '/digital-signage/tv-screen',
        icon: 'tv',
        label: 'TV Screen',
        subNav: null
      },
      {
        title: 'Media',
        href: '/digital-signage/media',
        icon: 'folder',
        label: 'Media',
        subNav: [
          {
            title: 'All Media',
            href: '/digital-signage/media/all',
            icon: 'folder',
            label: 'All Media'
          },
          {
            title: 'Images',
            href: '/digital-signage/media/images',
            icon: 'media',
            label: 'Images'
          },
          {
            title: 'Videos',
            href: '/digital-signage/media/videos',
            icon: 'video',
            label: 'Videos'
          }
        ]
      },
      {
        title: 'Links',
        href: '/digital-signage/links',
        icon: 'link',
        label: 'Links',
        subNav: null
      },
      {
        title: 'Playlist',
        href: '/digital-signage/playlist',
        icon: 'imagePlay',
        label: 'Playlist',
        subNav: null
      },
      {
        title: 'Scheduled slots',
        href: '/digital-signage/scheduled-slots',
        icon: 'calendarClock',
        label: 'Scheduled slots',
        subNav: null
      },
      {
        title: 'Location',
        href: '/digital-signage/location',
        icon: 'mapPin',
        label: 'Location',
        subNav: null
      },
      {
        title: 'Reports',
        href: '/digital-signage/reports',
        icon: 'note',
        label: 'Reports',
        subNav: null
      }
    ]
  },
  {
    title: 'ADMIN',
    items: [
      // {
      //   title: 'My Account',
      //   href: '/admin/my-account',
      //   icon: 'user',
      //   label: 'my-account',
      //   subNav: null
      // },
      {
        title: 'My Account',
        icon: 'user',
        label: 'my-account',
        subNav: [
          {
            title: 'Account Details',
            href: '/admin/my-account',
            icon: 'user',
            label: 'my-account'
          },
          {
            title: 'Billings',
            href: '/admin/billings',
            icon: 'billing',
            label: 'billings'
          }
        ]
      },
      {
        title: 'Users',
        href: '/admin/users',
        icon: 'users',
        label: 'users',
        subNav: null
      }
      // {
      //   title: 'Analytics',
      //   href: '/admin/analytics',
      //   icon: 'lineChart',
      //   label: 'analytics',
      //   subNav: null
      // }
    ]
  }
];
