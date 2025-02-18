'use client';
import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  // get pathname
  const path = usePathname();

  const getPageName = () => {
    if (path.includes('dashboard')) {
      return 'Dashboard';
    }

    if (path.includes('links')) {
      return 'Links';
    }
    if (path.includes('assign-tv-screen')) {
      return 'Assign TV Screen';
    }
    if (path.includes('tv-screen')) {
      return 'TV Screen';
    }
    if (path.includes('playlist')) {
      return 'Playlist';
    }
    if (path.includes('scheduled-slots')) {
      return 'Scheduled Slots';
    }
    if (path.includes('location')) {
      return 'Location';
    }
    if (path.includes('all')) {
      return 'All Media';
    }
    if (path.includes('media/add')) {
      return 'Add Media';
    }
    if (path.includes('images')) {
      return 'Images';
    }
    if (path.includes('videos')) {
      return 'Videos';
    }

    if (path.includes('users')) {
      return 'Users';
    }
    if (path.includes('analytics')) {
      return 'Analytics';
    }

    if (path.includes('my-account')) {
      return 'My Account';
    }

    if (path.includes('billings')) {
      return 'Billings';
    }

    if (path.includes('withdrawals')) {
      return 'Withdrawals';
    }

    if (path.includes('subscription-plans')) {
      return 'Subscription Plans';
    }

    if (path.includes('text-alert')) {
      return 'Text Alert';
    }

    if (path.includes('email-alert')) {
      return 'Email Alert';
    }

    if (path.includes('loyalty')) {
      return 'Loyalty';
    }
    // workplace
    // conversation, subscribers, calendar-system, pipeline-stages, social-planner, funnel-builder, website-builder, workflows-automations, music, clients, invoice
    if (path.includes('conversation')) {
      return 'Conversation';
    }
    if (path.includes('subscribers')) {
      return 'Subscribers';
    }
    if (path.includes('calendar-system')) {
      return 'Calendar System';
    }
    if (path.includes('pipeline-stages')) {
      return 'Pipeline Stages';
    }
    if (path.includes('social-planner')) {
      return 'Social Planner';
    }
    if (path.includes('funnel-builder')) {
      return 'Funnel Builder';
    }
    if (path.includes('website-builder')) {
      return 'Website Builder';
    }
    if (path.includes('workflows-automations')) {
      return 'Workflows & Automations';
    }
    if (path.includes('music')) {
      return 'Music';
    }
    if (path.includes('clients')) {
      if (path.includes('contacts')) {
        return 'Contacts';
      }
      if (path.includes('subscription-plan')) {
        return 'Subscription Plan';
      }
    }
    if (path.includes('invoice')) {
      return 'Invoice';
    }

    // queueing system links, customer-kiosk, assign-tv-screen,manage,reports
    if (path.includes('customer-kiosk')) {
      return 'Customer Kiosk';
    }

    if (path.includes('manage')) {
      return 'Manage';
    }

    if (path.includes('reports')) {
      return 'Reports';
    }
  };

  return (
    <div className="supports-backdrop-blur:bg-background/60 relative left-0 left-3 right-0 top-0 z-20  bg-[#f3f3f3] backdrop-blur">
      {/* <div className="supports-backdrop-blur:bg-background/60 relative left-0 left-3 right-0 top-0 z-20  bg-background/95 backdrop-blur"> */}
      <nav className="flex h-14 items-center justify-between px-4 ">
        <div className="hidden md:block">
          <span className="text-3xl">{getPageName()}</span>
        </div>
        {/* <div className="hidden lg:block">
          Adzeela icon & link
          <Link
            href={'https://github.com/Kiranism/next-shadcn-dashboard-starter'}
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
          </Link>
        </div> */}
        <div className={cn('block md:!hidden')}>
          <MobileSidebar />
        </div>
        <div className="user-greeting flex items-center gap-2">
           Hi, {session?.user?.name}!
          {/* <ThemeToggle /> */}
          <UserNav />
        </div>
      </nav>
    </div>
  );
}
