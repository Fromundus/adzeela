import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Folder, User2 } from 'lucide-react';
import React from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/confirm-dialog';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types/User';
import { deleteUser } from '@/app/api/userApi';

const UserGrid: React.FC<{ data: User[] }> = ({ data }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [updatedData, setUpdatedData] = React.useState<User[]>(data);

  const { toast } = useToast();
  const router = useRouter();

    React.useEffect(() => {
        setUpdatedData(data);
    }, [data]); 


  const handleDelete = async (userId:number) => {
    try {
      await deleteUser(userId);
      setUpdatedData((prevData: User[]) =>
        prevData.filter((item) => item.id !== userId)
      );
      toast({
        title: 'Success',
        description: 'User deleted successfully',
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleEdit = (userId: number) => {
    router.push(`/admin/users/${userId}`);
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
        {updatedData.map((userGroup: User) => {
          const formattedDate = userGroup.created_at
            ? format(
                new Date(userGroup.created_at),
                'EEEE MMMM dd, yyyy h:mm a'
              )
            : '';

          return (
            <div
              key={userGroup.id ?? userGroup.name}
              className="mt-3 grid grid-cols-1 space-y-5 divide-y divide-primary rounded-lg bg-white p-6 shadow-md lg:m-3 lg:mt-0"
            >
              <div className="flex justify-between">
                <div className="flex ">
                  <User2 className="h-16 w-16 text-gray-500" />

                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{userGroup.name}</h2>
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
                          handleView(userGroup.playlist_files ?? [])
                        }
                      >
                        View
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        onClick={() => userGroup.id && handleEdit(userGroup.id)}
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
                    onConfirm={() => handleDelete(userGroup.id!)}
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

export default UserGrid;
