import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { format } from 'date-fns';

const TvScreenGrid = ({ data }: { data: any }) => {
  return (
    <>
      <div className="grid xl:grid-cols-3">
        {data.map((tvScreen: any) => {
          const formattedDate = tvScreen.updated_at
            ? format(new Date(tvScreen.updated_at), 'EEEE MMMM dd, yyyy h:mm a')
            : '';

          const handleView = () => {
            // console.log(row?.original?.play_url, '_blank');
            window.open(tvScreen?.playlist?.play_url, '_blank');
          };

          return (
            <div
              key={tvScreen.name}
              className="mt-3 grid grid-cols-1 space-y-5 divide-y divide-primary rounded-lg bg-white p-6 shadow-md lg:m-3 lg:mt-0"
            >
              <div className="flex justify-between">
                <div className="flex ">
                  {tvScreen?.playlist?.preview_type == 'image' ? (
                    <div className="">
                      <Image
                        src={tvScreen?.playlist?.preview}
                        alt="placeholder"
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ) : tvScreen?.playlist?.preview_type == 'video' ? (
                    <video
                      src={tvScreen?.playlist?.preview}
                      width={80}
                      height={80}
                      controls={false}
                      className="rounded-lg object-cover"
                    />
                  ) : null}
                  {/* <Image
                    src={'/media/images/sidebar/adzeela-square.png'}
                    alt="placeholder"
                    width={80}
                    height={80}
                    className=" rounded-lg"
                  }
                  {/* <Image
                    src={'/media/images/sidebar/adzeela-square.png'}
                    alt="placeholder"
                    width={80}
                    height={80}
                    className=" rounded-lg"
                  /> */}

                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{tvScreen.name}</h2>
                    <p className="text-xs text-gray-500">{tvScreen.address}</p>
                  </div>
                </div>
                <div className="flex ">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleView}>
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>Push to TV Screen</DropdownMenuItem>

                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="pt-3">
                <p className="text-sm text-gray-500">
                  Updated on {formattedDate}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TvScreenGrid;
