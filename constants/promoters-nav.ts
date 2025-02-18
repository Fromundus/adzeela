import { NavGroup } from "@/types";

export const adminDigitalSignageNav: NavGroup[] = [
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
        title: 'Playlist',
        href: '/digital-signage/playlist',
        icon: 'imagePlay',
        label: 'Playlist',
        subNav: null
      },
      {
        title: 'Links',
        href: '/digital-signage/links',
        icon: 'link',
        label: 'Links',
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
