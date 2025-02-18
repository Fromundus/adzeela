import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import React from 'react';
import { format } from 'date-fns';
import { File } from '@/types/File';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/confirm-dialog';
import { MediaCarouselDialog } from '@/components/media-carousel-dialog';
import { useToast } from '@/components/ui/use-toast';
import { deleteFile } from '@/app/api/fileApi';

const MediaGrid = ({ data }: { data: File[] }) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [fileItems, setFileItems] = React.useState<File[]>([]);
  const [currentFile, setCurrentFile] = React.useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (currentFile) {
      try {
        await deleteFile(currentFile.id!);
        setFileItems((prevData) =>
          prevData.filter((item) => item.id !== currentFile?.id)
        );
        toast({
          title: 'Success',
          description: 'Media deleted successfully',
          variant: 'default'
        });
      } catch (error) {
        console.error('Failed to delete media:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete media',
          variant: 'destructive'
        });
      } finally {
        setDeleteDialogOpen(false);
        setCurrentFile(null);
      }
    }
  };

  const handleView = (file: File) => {
    setFileItems([file]);
    setCurrentFile(file);
    setViewDialogOpen(true);
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
        {data.map((file: File) => {
          const formattedDate = file.updated_at
            ? format(new Date(file.updated_at), 'EEEE MMMM dd, yyyy h:mm a')
            : '';

          return (
            <div
              key={file.id}
              className="mt-3 grid grid-cols-1 space-y-5 divide-y divide-primary rounded-lg bg-white p-6 shadow-md lg:m-3 lg:mt-0"
            >
              <div className="flex justify-between">
                <div className="grid w-full grid-cols-3 space-x-2">
                  <div className="flex">
                    {file.type === 'image' ? (
                      <div>
                        <img
                          src={file.displayImage}
                          alt={file.name}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    ) : file.type === 'video' ? (
                      <video
                        src={file.displayImage}
                        controls={false}
                        className="rounded-lg object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="col-span-2">
                    <h2 className="text-lg font-semibold">{file.name}</h2>
                  </div>
                </div>
                <div className="flex">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(file)}>
                        View
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem>Edit</DropdownMenuItem> */}
                      <DropdownMenuItem
                        onClick={() => {
                          setCurrentFile(file);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <ConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteDialogOpen(false)}
                  />

                  <MediaCarouselDialog
                    fileItems={fileItems}
                    isOpen={isViewDialogOpen}
                    onOpenChange={setViewDialogOpen}
                  />
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

export default MediaGrid;
