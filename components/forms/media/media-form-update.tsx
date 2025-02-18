'use client';
import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { UploadCloud, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Select from 'react-select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import {
  createMedia,
  updateMedia,
  fetchMediaById,
  addMedia,
  removeMediaFile
} from '@/app/api/mediaApi';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { removeExtensionName } from '@/components/utils/removeExtensionName';

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  type: z.enum(['file', 'folder'])
});

type MediaFormValue = z.infer<typeof formSchema>;

interface MediaFormProps {
  mode: 'add' | 'edit';
  mediaId?: number;
}

const MediaFormUpdate: React.FC<MediaFormProps> = ({ mode, mediaId }) => {
  const [previews, setPreviews] = useState<
    { url: string; name: string; file: File; base64: string }[]
  >([]);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [acceptType, setAcceptType] = useState<string>('');
  const [selectedFileType, setSelectedFileType] = useState<string>('');
  const [typeSelected, setTypeSelected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const methods = useForm<MediaFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { type: 'file' }
  });
  const { toast } = useToast();
  const router = useRouter();


  useEffect(() => {
    if (mode === 'edit' && mediaId) {
      const fetchData = async () => {
        try {
          const response = await fetchMediaById(mediaId);
          const mediaData = response.data.data;

          const mappedType = mediaData?.fileType === 'image' ? 'file' : 'file';

          methods.reset({
            name: mediaData.name,
            type: mappedType
          });
          setSelectedFileType(
            mediaData?.fileType === 'image' ? 'Images' : 'Videos'
          );

          setExistingFiles(mediaData.files || []);
        } catch (error: any) {
          toast({
            title: 'Error',
            description: `Failed to load media data: ${error.message}`,
            variant: 'destructive'
          });
        }
      };

      fetchData();
    }
  }, [mode, mediaId]);

  console.log('Existing files ', existingFiles);

  useEffect(() => {
    switch (selectedFileType) {
      case 'Images':
        setAcceptType('image/*');
        break;
      case 'Videos':
        setAcceptType('video/*');
        break;
      case 'Audio':
        setAcceptType('audio/*');
        break;
      case 'Documents':
        setAcceptType('.pdf,.doc,.docx,.xls,.xlsx');
        break;
      case 'Webpages':
        setAcceptType('.html,.htm');
        break;
      default:
        setAcceptType('');
    }
    setTypeSelected(!!selectedFileType);
    setPreviews([]);
    setMediaFiles([]);
  }, [selectedFileType]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);

      if (totalSize > 32 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Total file size exceeds 32MB. Please select smaller files.',
          variant: 'destructive'
        });
        return;
      }

      const newPreviews = await Promise.all(
        fileArray.map(async (file) => {
          const base64 = await convertToBase64(file);
          const fileURL = URL.createObjectURL(file);
          return { url: fileURL, name: removeExtensionName(file.name), file, base64 };
        })
      );

      let b64files: any = [];
      
      newPreviews.map((file) => {
        b64files = [...b64files, file];
      });

      try {
        const response = await addMedia(mediaId!, b64files);
        setExistingFiles(response.data.files);
        // setPreviews(newPreviews);
        // setMediaFiles(fileArray);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: `Failed to add media: ${error.message}`,
          variant: 'destructive'
        });
      }
    } else {
      // setPreviews([]);
      // setMediaFiles([]);
    }
  };


  const handleRemoveFile = async (fileToRemove: {
    url: string;
    name: string;
  }) => {
    setPreviews((prev) => {
      const newPreviews = prev.filter(
        (preview) => preview.name !== fileToRemove.name
      );
      return newPreviews;
    });

    URL.revokeObjectURL(fileToRemove.url);

    const updatedMediaFiles = mediaFiles.filter(
      (file) => file.name !== fileToRemove.name
    );
    setMediaFiles(updatedMediaFiles);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data: MediaFormValue) => {
    setLoading(true);

    // convert media files to base64 in mFiles array
    const mFiles = await Promise.all(
      mediaFiles.map(async (file) => {
        return await convertToBase64(file);
      })
    );

    let payload: any = {
      name: data.name,
      type: data.type
      // media_files: mFiles,
      // existing_files: null,
      // _method: mode === 'edit' ? 'PUT' : 'POST'
      //   existing_files: existingFiles.map((file) => file.id)
    };

    // console.log(payload);
    // setLoading(false);
    // return;

    // console.log(methods.getValues(), 'values');
    try {
      payload.existing_files = existingFiles.map((file) => file.id);

      await updateMedia(mediaId!, payload);

      toast({
        title: 'Success',
        description:
          mode === 'add'
            ? 'Media added successfully!'
            : 'Media updated successfully!',
        variant: 'default'
      });
      router.push('/digital-signage/media/all');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to ${mode === 'add' ? 'add' : 'update'} media: ${error.message
          }`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: 'Images', label: 'Images' },
    { value: 'Videos', label: 'Videos' }
    // { value: 'Audio', label: 'Audio' },
    // { value: 'Documents', label: 'Documents' },
    // { value: 'Webpages', label: 'Webpages' }
  ];

  const handleRemoveExistingFile = async (fileToRemove: any) => {
    const response = await removeMediaFile(fileToRemove.id);
    setExistingFiles(response.data.files);
    // setExistingFiles((prev) => {
    //   const newFiles = prev.filter((file) => file.id !== fileToRemove.id);
    //   return newFiles;
    // });
  };

  useEffect(() => {
    console.log(existingFiles);
  }, [existingFiles]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="grid xl:grid-cols-2">
          <div className="col-span-2 mb-5 w-1/2">
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Name..."
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2 w-1/2">
            <FormItem>
              <FormLabel>File Type</FormLabel>
              <FormControl>
                <Select
                  options={typeOptions}
                  placeholder="Select Type"
                  value={typeOptions.find(
                    (option:any) => option.value === selectedFileType
                  )}
                  onChange={(option:any) => {
                    const selectedType = option?.value as string;
                    setSelectedFileType(selectedType);
                  }}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </div>

        <div className="mt-[80px] space-y-4">
          <div className="mt-5 grid items-center justify-center">
            <h3 className="mb-2 text-center font-bold text-primary">
              Upload files from your device
            </h3>
            <p className="text-center text-sm">Maximum size allowed is 32MB</p>
          </div>

          <div
            className={`relative mt-[50px] cursor-pointer rounded-lg border-2 border-dashed bg-transparent p-5 ${!typeSelected ? 'bg-gray-100' : ''
              }`}
          >
            <input
              type="file"
              multiple
              accept={acceptType}
              onChange={handleFileChange}
              className={`absolute inset-0 opacity-0 ${!typeSelected ? 'cursor-not-allowed' : ''
                }`}
              disabled={!typeSelected}
            />
            <div className="flex h-full flex-col items-center justify-center">
              <UploadCloud
                className={`mb-2 text-gray-500 ${!typeSelected ? 'opacity-50' : ''
                  }`}
                size={40}
              />
              <p
                className={`font-semibold text-gray-500 ${!typeSelected ? 'opacity-50' : ''
                  }`}
              >
                Drop your files here or click to upload
              </p>
            </div>
          </div>

          <div className="relative mt-[50px] rounded-lg border-2 border-black bg-transparent p-5">
            {/* {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                {previews.map((preview, index) => (
                  <div
                    key={index + 1}
                    className="relative flex flex-col items-center"
                  >
                    {preview.file.type.startsWith('video/') ? (
                      <video
                        width="100%"
                        height="auto"
                        controls
                        src={preview.url}
                        className="w-full max-w-[150px]"
                      />
                    ) : (
                      <Image
                        src={preview.url}
                        alt={preview.name}
                        width={150}
                        height={150}
                        className="rounded-lg"
                      />
                    )}
                    <div className="mt-2 flex items-center justify-center">
                      <span className="text-sm">{preview.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(preview)}
                        className="ml-2 text-red-500"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )} */}

            {existingFiles.length > 0 && (
              <div className="grid grid-cols-4 gap-4 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {existingFiles.map((file:any, index:number) => (
                  <div
                    key={index + 1}
                    className="relative flex flex-col items-center"
                  >
                    {file.type.startsWith('video') ? (
                      <video
                        width="100%"
                        height="auto"
                        controls
                        src={file.displayImage}
                        className="w-full max-w-[150px]"
                      />
                    ) : (
                      <>
                        {/* <span>{file.displayImage}</span> */}
                        <img
                          src={file.displayImage}
                          alt=""
                          width={150}
                          height={150}
                          className="rounded-lg"
                        />
                        {/* <Image
                          src={file.displayImage}
                          // alt={file.name}
                          width={150}
                          height={150}
                          className="rounded-lg"
                        /> */}
                      </>
                    )}

                    <div className="mt-2 flex items-center justify-center">
                      <span className="break-all">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingFile(file)}
                        className="ml-2 text-red-500"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="mt-6">
          {loading
            ? 'Processing...'
            : mode === 'add'
              ? 'Add Media'
              : 'Update Media'}
          {loading && <Icons.spinner className="ml-2 animate-spin" />}
        </Button>
      </form>
    </FormProvider>
  );
};

export default MediaFormUpdate;
