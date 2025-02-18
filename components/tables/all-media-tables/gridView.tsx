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
import { Media } from '@/types/Media';
import { deleteMedia } from '@/app/api/mediaApi';
import { File } from '@/types/File';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/confirm-dialog';
import { MediaCarouselDialog } from '@/components/media-carousel-dialog';
import { useToast } from '@/components/ui/use-toast';

const AllMediaGrid = ({ data }: { data: Media[] }) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [fileItems, setFileItems] = React.useState<File[]>([]);
  const [currentMedia, setCurrentMedia] = React.useState<Media | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (currentMedia) {
      try {
        await deleteMedia(currentMedia.id!);

        setFileItems((prevData) =>
          prevData.filter((item) => item.id !== currentMedia.id)
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
        setCurrentMedia(null);
      }
    }
  };

  const handleEdit = () => {
    if (currentMedia) {
      router.push(`/digital-signage/media/${currentMedia.id}`);
    }
  };

  const handleView = (media: Media) => {
    setFileItems(media.files ?? []);
    setCurrentMedia(media);
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
        {data.map((fileGroup: Media) => {
          const files = fileGroup.files ?? [];
          const isSingleFile = files.length === 1;
          const file = files[0];

          const formattedDate = fileGroup.updated_at
            ? format(
              new Date(fileGroup.updated_at),
              'EEEE MMMM dd, yyyy h:mm a'
            )
            : '';

          return (
            <div
              key={fileGroup.id}
              className="mt-3 grid grid-cols-1 space-y-5 divide-y divide-primary rounded-lg bg-white p-6 shadow-md lg:m-3 lg:mt-0"
            >
              <div className="flex justify-between">
                <div className="grid w-full grid-cols-3 space-x-2">
                  <div className="flex">
                    {files.length > 1 ? (
                      <Folder className="h-20 w-20 text-gray-500" />
                    ) : isSingleFile ? (
                      file?.type === 'image' ? (
                        <div>
                          <img
                            src={file.displayImage}
                            alt={file?.name}
                            width={100}
                            height={100}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      ) : file?.type === 'video' ? (
                        <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                          <video
                            src={file.displayImage}
                            className="h-full w-full object-cover"
                            controls={false}
                            muted
                            width={100}
                            height={100}
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ) : null
                    ) : null}
                  </div>
                  <div className="col-span-2">
                    <h2 className="text-lg font-semibold">{fileGroup.name}</h2>
                    <p className="text-xs text-gray-500">Not published</p>
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
                      <DropdownMenuItem onClick={() => handleView(fileGroup)}>
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleEdit}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          // setCurrentMedia(fileGroup);
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

export default AllMediaGrid;
