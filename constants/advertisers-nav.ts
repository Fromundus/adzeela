import { NavGroup } from "@/types";

export const advertisersNav: NavGroup[] = [
  {
    title: 'DIGITAL SIGNAGE',
    items: [
      {
        title: 'Scheduled slots',
        href: '/digital-signage/scheduled-slots',
        icon: 'calendarClock',
        label: 'Scheduled slots',
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
  }
];
