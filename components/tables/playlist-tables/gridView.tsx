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
import { Playlist } from '@/types/Playlist';
import { useRouter } from 'next/navigation';
import { deletePlaylist } from '@/app/api/playlistApi';
import ConfirmDialog from '@/components/confirm-dialog';
import { useToast } from '@/components/ui/use-toast';
import { File } from '@/types/File';
import { MediaCarouselDialog } from '@/components/media-carousel-dialog';

const PlaylistGrid: React.FC<{ data: Playlist[] }> = ({ data }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [fileItems, setFileItems] = React.useState<File[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = React.useState<
    number | undefined
  >();
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (selectedPlaylistId !== undefined) {
      try {
        await deletePlaylist(selectedPlaylistId);
        toast({
          title: 'Success',
          description: 'Playlist deleted successfully.',
          variant: 'default'
        });
      } catch (error) {
        console.error('Failed to delete playlist:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete playlist.',
          variant: 'destructive'
        });
      } finally {
        setIsDialogOpen(false);
      }
    }
  };

  const handleEdit = (playlistId: number) => {
    router.push(`/digital-signage/playlist/${playlistId}`);
  };

  const handleView = (files: File[]) => {
    setFileItems(files);
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
        {data.map((fileGroup: Playlist) => {
          const formattedDate = fileGroup.updated_at
            ? format(
                new Date(fileGroup.updated_at),
                'EEEE MMMM dd, yyyy h:mm a'
              )
            : '';

          return (
            <div
              key={fileGroup.id ?? fileGroup.name}
              className="mt-3 grid grid-cols-1 space-y-5 divide-y divide-primary rounded-lg bg-white p-6 shadow-md lg:m-3 lg:mt-0"
            >
              <div className="flex justify-between">
                <div className="flex ">
                  <Folder className="h-16 w-16 text-gray-500" />

                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{fileGroup.name}</h2>
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
                      <DropdownMenuItem
                        onClick={() =>
                          handleView(fileGroup.playlist_files ?? [])
                        }
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => fileGroup.id && handleEdit(fileGroup.id)}
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
                    onConfirm={handleDelete}
                    onClose={() => setIsDialogOpen(false)}
                  />

                  <MediaCarouselDialog
                    fileItems={fileItems}
                    isOpen={isViewDialogOpen}
                    onOpenChange={setViewDialogOpen}
                    autoplay={false}
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

export default PlaylistGrid;
