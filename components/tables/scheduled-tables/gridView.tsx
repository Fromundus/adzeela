import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Folder } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { format } from 'date-fns';

const ScheduledSlotsGrid = ({ data }: { data: any }) => {
  return (
    <>
      <div className="grid xl:grid-cols-3">
        {data.map((fileGroup: any) => {
          const formattedDate = fileGroup.updated_at
            ? format(
                new Date(fileGroup.updated_at),
                'EEEE MMMM dd, yyyy h:mm a'
              )
            : '';

          const handleView = () => {
            // console.log(row?.original?.play_url, '_blank');
            // window.open(fileGroup?.play_url, '_blank');
          };

          return (
            <div
              key={fileGroup.name}
              className="mt-3 grid grid-cols-1 space-y-5 divide-y divide-primary rounded-lg bg-white p-6 shadow-md lg:m-3 lg:mt-0"
            >
              <div className="flex justify-between">
                <div className="flex ">
                  {/* <iframe
                    src={fileGroup.play_url}
                    width="150"
                    height="100"
                    className="rounded-lg"
                  /> */}
                  <Folder className="h-16 w-16 text-gray-500" />
                  {/* {fileGroup.files.length > 1 ? (
                                        <Folder className="h-16 w-16 text-gray-500" />
                                    ) : isSingleFile ? (
                                        file.type === 'image' ? (
                                            <Image
                                                src={imageUrl}
                                                alt={file.name}
                                                width={80}
                                                height={80}
                                                className="rounded-lg"
                                            />
                                        ) : file.type === 'video' ? (
                                            <video
                                                src={imageUrl}
                                                width={80}
                                                height={80}
                                                controls={false}
                                                className="rounded-lg"
                                            />
                                        ) : null
                                    ) : null} */}
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{fileGroup.name}</h2>
                    <p className="text-xs text-gray-500">{fileGroup.address}</p>
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
                        View
                      </DropdownMenuItem>
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

export default ScheduledSlotsGrid;
