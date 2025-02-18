import { NavGroup } from "@/types";

export const workplaceNav: NavGroup[] = [
  {
    title: 'Workplace',
    items: [
      {
        title: 'Dashboard',
        href: '/workplace/dashboard',
        icon: 'dashboard',
        label: 'Dashboard',
        subNav: null
      },
      {
        title: 'Conversation',
        href: '/workplace/conversation',
        icon: 'conversation',
        label: 'Converation',
        subNav: null
      },
      {
        title: 'Subscribers',
        href: '/workplace/subscribers',
        icon: 'folder',
        label: 'Subscribers',
        subNav: [
          {
            title: 'Contacts',
            href: '/workplace/all-subscribers',
            icon: 'contacts',
            label: 'Contacts'
          }
        ]
      },
      {
        title: 'Calendar system',
        href: '/workplace/calendar-system',
        icon: 'calendarSystem',
        label: 'Calendar system',
        subNav: null
      },
      {
        title: 'Pipeline stages',
        href: '/workplace/pipeline-stages',
        icon: 'pipeline',
        label: 'Pipeline stages',
        subNav: null
      },
      {
        title: 'Social Planner',
        href: '/workplace/social-planner',
        icon: 'socialPlanner',
        label: 'Social Planner',
        subNav: null
      },
      {
        title: 'Funnel Builder',
        href: '/workplace/funnel-builder',
        icon: 'funnelBuilder',
        label: 'Funnel Builder',
        subNav: null
      },
      {
        title: 'Website Builder',
        href: '/workplace/website-builder',
        icon: 'websiteBuilder',
        label: 'Website Builder',
        subNav: null
      },
      {
        title: 'Workflows & Automations',
        href: '/workplace/workflows-automations',
        icon: 'workflows',
        label: 'Workflows & Automations',
        subNav: null
      },
      {
        title: 'Music',
        href: '/workplace/music',
        icon: 'music',
        label: 'Music',
        subNav: null
      },
      {
        title: 'Clients',
        href: '/workplace/clients',
        icon: 'note',
        label: 'Clients',
        subNav: [
          {
            title: 'Contacts',
            href: '/workplace/clients/contacts',
            icon: 'contacts',
            label: 'Contacts'
          },
          {
            title: 'Subscription Plan',
            href: '/workplace/clients/subscription-plan',
            icon: 'subscriptionPlan',
            label: 'Subscription Plan'
          }
        ]
      },
      {
        title: 'Invoice',
        href: '/workplace/invoice',
        icon: 'invoice',
        label: 'Invoice',
        subNav: null
      }
    ]
  }
];
