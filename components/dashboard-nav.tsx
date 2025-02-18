'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { NavGroup, NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from './ui/accordion';

interface DashboardNavProps {
  navGroups: NavGroup[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  navGroups,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();

  if (!navGroups?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-1">
      <TooltipProvider>
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {!isMinimized && <span className="ml-3 text-primary">{group.title}</span>}
            {group.items.map((item, itemIndex) => {
              const Icon = Icons[item.icon || 'arrowRight'];

              if (item.subNav !== null && item.subNav.length > 0) {
                return (
                  <Accordion key={itemIndex} type="single" collapsible>
                    <AccordionItem value={item.title} className="border-b-0">
                      <AccordionTrigger>
                        <div className="flex items-center justify-start gap-2">
                          {item.icon && <Icon className={`ml-3 size-5`} />}
                          {!isMinimized && item.title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div
                          className={
                            isMinimized
                              ? `flex flex-col space-y-1`
                              : `ml-7 flex flex-col space-y-1`
                          }
                        >
                          {item.subNav.map((child, childIndex) => {
                            const ChildIcon = Icons[child.icon || 'arrowRight'];
                            return (
                              <Tooltip key={childIndex}>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      'flex items-center gap-2 overflow-hidden rounded-md py-4 text-sm font-medium hover:bg-purple-100 hover:text-accent-foreground',
                                      path === child.href
                                        ? 'bg-purple-200'
                                        : 'transparent',
                                      child.disabled &&
                                        'cursor-not-allowed opacity-80'
                                    )}
                                    onClick={() => {
                                      if (setOpen) setOpen(false);
                                    }}
                                  >
                                    <div className="flex items-center justify-start gap-2">
                                      {child.icon && (
                                        <ChildIcon className={`ml-3 size-5`} />
                                      )}
                                      {!isMinimized && child.title}
                                    </div>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent
                                  align="center"
                                  side="right"
                                  sideOffset={8}
                                  className={
                                    !isMinimized ? 'hidden' : 'inline-block'
                                  }
                                >
                                  {child.title}
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              } else {
                return (
                  item.href && (
                    <Tooltip key={itemIndex}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.disabled ? '/' : item.href}
                          className={cn(
                            'my-2 flex items-center gap-2 overflow-hidden rounded-md py-4 text-sm font-medium hover:bg-purple-100 hover:text-accent-foreground',
                            path.includes(item.href)
                              ? 'bg-purple-200'
                              : 'transparent',
                            item.disabled && 'cursor-not-allowed opacity-80'
                          )}
                          onClick={() => {
                            if (setOpen) setOpen(false);
                          }}
                        >
                          <Icon className={`ml-3 size-5`} />
                          {isMobileNav || (!isMinimized && !isMobileNav) ? (
                            <span className="mr-2 truncate">{item.title}</span>
                          ) : (
                            ''
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        align="center"
                        side="right"
                        sideOffset={8}
                        className={!isMinimized ? 'hidden' : 'inline-block'}
                      >
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  )
                );
              }
            })}
          </div>
        ))}
      </TooltipProvider>
    </nav>
  );
}
