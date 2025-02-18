import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

import ReactSelect from '@/components/ui/r-select';
import { Card } from '@/components/ui/card';
import { Link } from '@/types/Link';
import { createLinks, updateLinks, fetchLinksById } from '@/app/api/linkApi';

const formSchema = z.object({
  file_name: z.string().nonempty('File name is required'),
  video_type: z.string().nonempty('Video type name is required'),
  url: z.string().nonempty('url is required'),
  name: z.string()
});

type LinkFormValue = z.infer<typeof formSchema>;

interface LinkInfoFormProps {
  mode: 'add' | 'edit';
  linkId?: number;
}

const defaultValues = {
  file_name: '',
  video_type: 'link',
  url: '',
  name: ''
};

const LinkInfoForm: React.FC<LinkInfoFormProps> = ({ mode, linkId }) => {
  const methods = useForm<LinkFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  // TODO this options should be retrieve in the backend or transfer to seperate file

  const videoTypeOptions = [
    { label: 'Link', value: 'link' },
    { label: 'Video File', value: 'video_file' }
  ];

  useEffect(() => {
    if (mode === 'edit' && linkId) {
      const fetchData = async () => {
        try {
          const response = await fetchLinksById(linkId);
          const linkData = response.data;

          methods.reset({
            file_name: linkData.file_name ?? '',
            url: linkData.url ?? '',
            name: linkData.name ?? '',
            video_type: linkData.video_type
          });
        } catch (error: any) {
          toast({
            title: 'Error',
            description: `Failed to load link data: ${error.message}`,
            variant: 'destructive'
          });
        }
      };

      fetchData();
    }
  }, [mode, linkId]);

  const onSubmit = async (data: LinkFormValue) => {
    setLoading(true);
    try {
      console.log(data);
      if (mode === 'add') {
        await createLinks(data);
        toast({
          title: 'Success',
          description: 'Link created successfully!',
          variant: 'default'
        });
        router.push('/digital-signage/links');
      } else if (mode === 'edit' && linkId) {
        await updateLinks(linkId, data);
        toast({
          title: 'Success',
          description: 'Link updated successfully!',
          variant: 'default'
        });
        router.push('/digital-signage/links');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message
          ? error.message
          : 'There was an error saving the link.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-4">
        <p className="mb-3 text-primary">
          {mode === 'add' ? 'Create Link' : 'Edit Link'}
        </p>
      </div>

      <Card>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-full space-y-4 p-6"
          >
            <div className="grid space-x-3 space-y-3 xl:grid-cols-3">
              <div className="col-span-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FormField
                      control={methods.control}
                      name="file_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>File Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter file name"
                              //   disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={methods.control}
                      name="video_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video Type</FormLabel>
                          <FormControl>
                            <ReactSelect
                              {...field}
                              id="video_type"
                              name="video_type"
                              options={videoTypeOptions}
                              getOptionLabel={(option: any) => option.label}
                              getOptionValue={(option: any) => option.value}
                              className="w-full"
                              value={videoTypeOptions.find(
                                (option) => option.value === field.value
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={methods.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Paste URL here</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter url here"
                              //   disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={methods.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter name"
                              //   disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-x-3" style={{ textAlign: 'right' }}>
              <Button
                type="button"
                className="rounded-sm"
                variant="outline"
                onClick={() => router.push('/digital-signage/links')}
              >
                Back
              </Button>
              <Button type="submit" className="rounded-sm">
                {mode === 'add' ? 'Create' : 'Update'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </>
  );
};

export default LinkInfoForm;
