import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Folder } from 'lucide-react';
import React from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/confirm-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Link } from '@/types/Link';
import { deleteLinks } from '@/app/api/linkApi';

const LinkGrid: React.FC<{ data: Link[] }> = ({ data }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [updatedData, setUpdatedData] = React.useState<Link[]>(data);

  const { toast } = useToast();
  const router = useRouter();
  

    React.useEffect(() => {
        setUpdatedData(data);
    }, [data]); 
    

  const handleDelete = async (linkId:number) => {
    try {
      await deleteLinks(linkId);
      setUpdatedData((prevData: Link[]) =>
        prevData.filter((item) => item.id !== linkId)
      );
      toast({
        title: 'Success',
        description: 'Link deleted successfully',
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to delete link:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete link',
        variant: 'destructive'
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleEdit = (linkId: number) => {
    router.push(`/digital-signage/links/${linkId}`);
  };

  React.useEffect(() => {
    if (isViewDialogOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
      }, 1000);
    }
  }, [isViewDialogOpen]);

  return (
    <>
      <div className="grid xl:grid-cols-3">
        {updatedData.map((linkGroup: Link) => {
          const formattedDate = linkGroup.created_at
            ? format(
                new Date(linkGroup.created_at),
                'EEEE MMMM dd, yyyy h:mm a'
              )
            : '';

          return (
            <div
              key={linkGroup.id ?? linkGroup.name}
              className="mt-3 grid grid-cols-1 space-y-5 divide-y divide-primary rounded-lg bg-white p-6 shadow-md lg:m-3 lg:mt-0"
            >
              <div className="flex justify-between">
                <div className="flex ">
                  <Folder className="h-16 w-16 text-gray-500" />

                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{linkGroup.name}</h2>
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
                      {/* <DropdownMenuItem
                        onClick={() =>
                          handleView(linkGroup.playlist_files ?? [])
                        }
                      >
                        View
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        onClick={() => linkGroup.id && handleEdit(linkGroup.id)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <ConfirmDialog
                    isOpen={isDialogOpen}
                    onConfirm={() => handleDelete(linkGroup.id!)}
                    onClose={() => setIsDialogOpen(false)}
                  />

                  {/* <MediaCarouselDialog
                    fileItems={fileItems}
                    isOpen={isViewDialogOpen}
                    onOpenChange={setViewDialogOpen}
                    autoplay={false}
                  /> */}
                </div>
              </div>
              <div className="pt-3">
                <p className="text-sm text-gray-500">
                  Created on {formattedDate}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default LinkGrid;
