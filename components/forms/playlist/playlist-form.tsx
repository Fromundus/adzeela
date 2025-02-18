import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Dot, Plus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { fetchFiles } from '@/app/api/fileApi';
import {
  fetchPlaylistById,
  updatePlaylist,
  createPlaylist
} from '@/app/api/playlistApi';
import { format } from 'date-fns';
import { File } from '@/types/File';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

const screenSizeOptions = [
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' }
];

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  setup: z.string().min(1, 'Setup is required').default("landscape")
});

type PlaylistFormValue = z.infer<typeof formSchema>;

interface PlaylistFormProps {
  mode: 'add' | 'edit';
  playlistId?: number;
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({ mode, playlistId }) => {
  const methods = useForm<PlaylistFormValue>({
    resolver: zodResolver(formSchema)
  });
  const { setValue, getValues } = methods;
  const [files, setFiles] = useState<File[]>([]);
  const [topTableData, setTopTableData] = useState<File[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFiles();
        setFiles(response.data);

        if (mode === 'edit' && playlistId) {
          const playlistResponse = await fetchPlaylistById(playlistId);
          const playlist = playlistResponse.data.data;
          console.log("playlist",playlist)
          methods.reset({
            name: playlist.name,
            setup: playlist.setup,
          });
          setTopTableData(playlist.playlist_files || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mode, playlistId, setValue]);

  useEffect(() => {
    const remainingFiles = files.filter(
      (file) => !topTableData.some((selected) => selected.id === file.id)
    );
    setFilteredFiles(remainingFiles);
  }, [files, topTableData]);

  const handleAddFile = (file: File) => {
    setTopTableData((prevTopTableData) => {
      const updatedFiles = files.filter((f) => f.id !== file.id);
      setFiles(updatedFiles);
      return [...prevTopTableData, file];
    });
  };

  const handleRemoveFile = (file: File) => {
    setTopTableData((prevTopTableData) => {
      const updatedTopTableData = prevTopTableData.filter(
        (f) => f.id !== file.id
      );

      const updatedFiles = [...files, file];
      setFiles(updatedFiles);

      return updatedTopTableData;
    });
  };

  const renderFilePreview = (file: File) => {
    const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/${file.path}`;
    return (
      <div className="flex items-center space-x-4">
        {file.type === 'image' ? (
          <img
            src={file.displayImage}
            alt={file.name}
            className="h-24 w-24 rounded-lg object-cover"
          />
        ) : file.type === 'video' ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-lg">
            <video
              src={file.displayImage}
              className="h-full w-full object-cover"
              controls={false}
              muted
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-200">
            <Dot className="h-6 w-6" />
          </div>
        )}
      </div>
    );
  };

  const todayDate = format(new Date(), 'dd/MM/yyyy');

  const onSubmit = async (data: PlaylistFormValue) => {
    const formData = new FormData();
    let fileTemp: any = [];

    topTableData.map((file: any) => {
      //   fileTemp.push({ id: file.id });
      const newFileTemp = {
        id: file.id
      };
      fileTemp = [...fileTemp, newFileTemp];
    });

    const payload = {
      name: data.name,
      setup: data.setup,
      media_files: fileTemp
    };

    // formData.append('name', data.name);
    // formData.append('media_files', fileTemp);

    try {
      if (mode === 'add') {
        await createPlaylist(payload);
        toast({
          title: 'Playlist created successfully',
          description:
            'The playlist has been created and files have been added.',
          variant: 'default'
        });
      } else if (mode === 'edit' && playlistId) {
        await updatePlaylist(playlistId, payload);
        toast({
          title: 'Playlist updated successfully',
          description:
            'The playlist has been updated and files have been modified.',
          variant: 'default'
        });
      }
      router.push('/digital-signage/playlist');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Something went wrong.',
        variant: 'destructive'
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="m-2">
          <div className="mt-4 flex items-center justify-between">
            <p className="mb-3 text-primary">
              {mode === 'add' ? 'Create Playlist' : 'Edit Playlist'}
            </p>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                className="rounded-sm"
                variant="outline"
                onClick={() => router.push('/digital-signage/playlist')}
              >
                Back
              </Button>
              <Button type="submit" className="rounded-sm">
                {mode === 'add' ? 'Create' : 'Update'}
              </Button>
            </div>
          </div>

          <Card className="mb-4 mt-5 p-10">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>Name:</span>
                <FormField
                  control={methods.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="Untitled"
                          className="border-none outline-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-sm text-gray-500">{todayDate}</p>
            </div>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>Setup:</span>
                <FormField
                  control={methods.control}
                  name="setup"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          {...field}
                          options={screenSizeOptions}
                          placeholder="Select Screen Size..."
                          getOptionLabel={(option:any) => option.label}
                          getOptionValue={(option:any) => option.value}
                          onChange={(selectedOption:any) => {
                            methods.setValue('setup', selectedOption?.value || '');
                          }}
                          value={
                            screenSizeOptions.find(
                              (option:any) => option.value === methods.watch('setup')
                            ) || null
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-start">
              <p className="mb-3 text-primary">Files</p>
            </div>

            <Table className="w-full">
              <TableBody>
                {topTableData.length ? (
                  topTableData.map((file:any, index:any) => (
                    <TableRow key={`${file.id}-${index}`} className="border-b">
                      <TableCell>{renderFilePreview(file)}</TableCell>
                      <TableCell className="font-bold">{file.name}</TableCell>
                      <TableCell>{file.type}</TableCell>
                      <TableCell>
                        {file.created_at
                          ? format(new Date(file.created_at), 'dd/MM/yyyy')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleRemoveFile(file)}
                            >
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="p-4 text-center" colSpan={6}>
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="m-2">
          <div className="mt-4 flex items-center justify-start">
            <p className="mb-3 text-primary">All Media</p>
          </div>

          <Card className="p-10">
            <Table className="w-full">
              <TableBody>
                {filteredFiles.length ? (
                  filteredFiles.map((file) => (
                    <TableRow key={file.id} className="border-b">
                      <TableCell>
                        <Plus
                          className="h-6 w-6 cursor-pointer font-bold text-primary"
                          onClick={() => handleAddFile(file)}
                        />
                      </TableCell>
                      <TableCell>{renderFilePreview(file)}</TableCell>
                      <TableCell className="font-bold">{file.name}</TableCell>
                      <TableCell>{file.type}</TableCell>
                      <TableCell>
                        {file.created_at
                          ? format(new Date(file.created_at), 'dd/MM/yyyy')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{file.size}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="p-4 text-center" colSpan={6}>
                      No media available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </form>
    </FormProvider>
  );
};

export default PlaylistForm;
