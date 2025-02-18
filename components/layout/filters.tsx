import React from 'react';
import { InputProps } from '../ui/input';
import { cn } from '@/lib/utils';
import { SearchIcon, Grip, AlignJustify } from 'lucide-react';
import { Button } from '../ui/button';

const Filters = ({
  search,
  view,
  handleViewChange
}: {
  search: any;
  view: any;
  handleViewChange: any;
}) => {
  return (
    <div className="grid space-y-3 lg:grid-cols-6 lg:space-x-3 lg:space-y-0">
      <div className="lg:col-span-3">
        <Search />
      </div>
      <div className="col-span-1 flex items-center">
        <Button
          className="bg-white text-primary hover:text-white"
          onClick={handleViewChange}
        >
          {view === 'list' ? <AlignJustify /> : <Grip />}
        </Button>
      </div>
    </div>
  );
};

const Search = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex h-10 items-center rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2',
          className
        )}
      >
        <SearchIcon className="h-[16px] w-[16px]" />
        <input
          {...props}
          type="search"
          ref={ref}
          className="w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    );
  }
);

Search.displayName = 'Search';

export default Filters;
