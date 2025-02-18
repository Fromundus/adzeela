import React from 'react';
import { InputProps } from '../ui/input';
import { cn } from '@/lib/utils';
import { SearchIcon, Grip, AlignJustify } from 'lucide-react';
import { Button } from '../ui/button';
import Select from 'react-select';

const FiltersWithSort = ({
  search,
  view,
  filter,
  handleViewChange,
  handleFilterByChange,
  handleSearchChange
}: {
  search: any;
  view: any;
  filter:any
  handleViewChange: any;
  handleFilterByChange: any;
  handleSearchChange:any;

}) => {
  const customStyles = {
    option: (base: any, { isSelected, isFocused }: any) => ({
      ...base,
      // Option background color and text color
      backgroundColor: 'transparent',
      color: 'black',
      padding: '0.50rem 0.75rem',
      borderRadius: 'none',
      fontSize: '0.875rem',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgb(243 232 255 / var(--tw-bg-opacity, 1))',
        color: 'rgb(167 45 203 / var(--tw-text-opacity, 1))'
      }
    })
  };

  //TODO: make options dynamic
  const setupOptions = [
    { value: 'name', label: 'By Name' },
    { value: 'status', label: 'By Status' }
  ];

  return (
    <div className="grid space-y-3 lg:grid-cols-6 lg:space-x-3 lg:space-y-0">
      <div className="lg:col-span-3">
        <Search 
          onChange={handleSearchChange} 
          value={search} 
        />
      </div>
      <div>
        <Select
          styles={customStyles}
          options={setupOptions}
          placeholder="Filter"
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.value}
          onChange={handleFilterByChange}
          value={setupOptions.find(option => option.value === filter)}
        />
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

export default FiltersWithSort;
