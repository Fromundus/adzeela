import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
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
import { Playlist } from '@/types/Playlist';
import Select from 'react-select';
import SearchLocationInput from '@/components/search-location-input';
import { Icons } from '@/components/icons';
import {
  createTvScreen,
  fetchTvScreenById,
  updateTvScreen
} from '@/app/api/tvScreenApi';
import { fetchPlaylists } from '@/app/api/playlistApi';
import { useSession } from 'next-auth/react';

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  address: z.string().optional(),
  zip_code: z.string().nonempty('Zipcode is required'),
  price: z.number().optional(),
  setup: z.string().nonempty('Setup is required'),
  size: z.string().nonempty('Screen size is required'),
  playlist_id: z.number().optional(),
  webPlayerUrl: z.string().nonempty('Web player URL is required')
});

type TvScreenFormValue = z.infer<typeof formSchema>;



interface ScreenInfoFormProps {
  playlists?: Playlist[];
  setSelectedPlaylist: (playlist: Playlist | null) => void;
  setRotate: (rotate: boolean) => void;
  mode: 'add' | 'edit';
  tvScreenId?: number;
  handleIframe: any;
}

const setupOptions = [
  { value: 'Menu', label: 'Menu' },
  { value: 'Promotions', label: 'Promotions' }
];

const screenSizeOptions = [
  { value: 'Portrait', label: 'Portrait' },
  { value: 'Landscape', label: 'Landscape' }
];

const ScreenInfoForm: React.FC<ScreenInfoFormProps> = ({
  playlists,
  setSelectedPlaylist,
  setRotate,
  mode,
  tvScreenId,
  handleIframe
}) => {

  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);

  const methods = useForm<TvScreenFormValue>({
    resolver: zodResolver(formSchema)
  });
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const orientation = methods.watch('size');
  const [disabledPlayList, setDisabledPlayList] = useState(true);


  const { data: session } = useSession();

  const plan = session?.user?.subscription_plan;
  if (plan?.includes("Basic")) {
    methods.setValue('price', 5);
  } else if (plan?.includes("Standard")) {
    methods.setValue('price', 12);
  } else if (plan?.includes("Premium")) {
    methods.setValue('price', 20);
  } else {
    methods.setValue('price', 1);
  }

  // if (session?.user)
  
  useEffect(() => {
   
    if (orientation) {
      getPlayList();
      setDisabledPlayList(false);
    }
  },[orientation])
  const getPlayList = async () => {
    console.log("orientation",orientation)
    const response = await fetchPlaylists(orientation)
    const playlist = response.data.data;
    setPlaylistData(playlist);
    
  }
  useEffect(() => {
    if (mode === 'edit' && tvScreenId) {
      const fetchData = async () => {
        try {
          const response = await fetchTvScreenById(tvScreenId);
          const playlist = response.data.playlist;
          const webUrl = playlist?.play_url || response.data.webPlayerUrl || ''
          methods.reset({
            name: response.data.name || '',
            address: response.data.address || '',
            zip_code: response.data.zip_code || '',
            setup: response.data.setup || '',
            size: response.data.size || '',
            price: response.data.price || '',
            playlist_id: response.data.playlist_id || null,
            webPlayerUrl: webUrl+'&tv='+tvScreenId+'&allow=true'
          });

          if (playlist) {
            handlePlaylistChange(playlist);
          } else {
            setSelectedPlaylist(null);
          }

          if (response.data.size === 'Portrait') {
            setRotate(true);
          } else {
            setRotate(false);
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to fetch TV screen data.',
            variant: 'destructive'
          });
        }
      };
      fetchData();
    }
  }, [mode, tvScreenId, methods, setSelectedPlaylist, toast]);

  const handleSelectLocation = (
    latLng: { lat: number | undefined; lng: number | undefined },
    display_name: string,
    postalCode: string
  ) => {
    if (!display_name) {
      methods.setValue('address', '');
      methods.setValue('zip_code', '');
    } else {
      methods.setValue('address', display_name);
      methods.setValue('zip_code', postalCode);
    }
  };

  const handlePlaylistChange = (selectedOption: any) => {
    setSelectedPlaylist(selectedOption);
    const orientation = methods.watch('size');
    const webPlayerUrl =
      selectedOption?.play_url + '?orientation=' + orientation+'&tv='+tvScreenId+'&allow=true' || ''+'&tv='+tvScreenId+'&allow=true';
    methods.setValue('playlist_id', selectedOption?.id || null);
    methods.setValue('webPlayerUrl', webPlayerUrl || '');
    handleIframe(webPlayerUrl);
  };

  const onSubmit = async (data: TvScreenFormValue) => {
    setLoading(true);
    try {
      if (mode === 'add') {
        await createTvScreen(data);
        toast({
          title: 'Success',
          description: 'TV Screen created successfully!',
          variant: 'default'
        });
        router.push('/digital-signage/tv-screen');
      } else if (mode === 'edit' && tvScreenId) {
        await updateTvScreen(tvScreenId, data);
        toast({
          title: 'Success',
          description: 'TV Screen updated successfully!',
          variant: 'default'
        });
        router.push('/digital-signage/tv-screen');
      }
    } catch (error:any) {
      toast({
        title: 'Error',
        description: error.message? error.message: 'There was an error saving the TV Screen.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScreenChange = (selectedOption: any) => {
    methods.setValue('size', selectedOption?.value || '');
    const playlist_id = methods.watch('playlist_id');
    const playlist = playlistData.find((playlist) => playlist.id === playlist_id);
    console.log(playlist, 'playlist');

    if (playlist !== null) {
      const webPlayerUrl =
        playlist?.play_url + '?orientation=' + selectedOption.value+'&tv='+tvScreenId+'&allow=true' || ''+'&tv='+tvScreenId+'&allow=true';
      console.log(webPlayerUrl, 'webPlayerUrl');
      handleIframe(webPlayerUrl);
      // const webPlayerUrl =
      // selectedOption?.play_url + '?orientation=' + orientation || '';
      // use the code above to replicate the function
      // const webPlayerUrl = selectedOption?.play_url || '';
      // console.log(
      //   'screen change to ' + selectedOption?.value + ' playlist is ' + playlist
      // );
      // handlePlaylistChange(playlists.find((playlist) => playlist.id === playlist) || null);
    }
    // setRotate(selectedOption?.value === 'Portrait');
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="grid space-x-3 space-y-3 xl:grid-cols-3">
          <div className="col-span-3"></div>
          <div className="col-span-3">
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter TV Screen Name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-3 xl:col-span-2">
            <FormField
              control={methods.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <SearchLocationInput
                      setSelectedLocation={handleSelectLocation}
                      initialValue={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-3 xl:col-span-1">
            <FormField
              control={methods.control}
              name="zip_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zipcode</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Zipcode..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3">
            <FormField
              control={methods.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Price..."
                      {...field}
                      disabled={!plan?.includes("Premium")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="col-span-3">
            <FormField
              control={methods.control}
              name="setup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setup</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      options={setupOptions}
                      placeholder="Select Setup..."
                      getOptionLabel={(option:any) => option.label}
                      getOptionValue={(option:any) => option.value}
                      onChange={(selectedOption:any) => {
                        methods.setValue('setup', selectedOption?.value || '');
                      }}
                      value={
                        setupOptions.find(
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
          <div className="col-span-3">
            <FormField
              control={methods.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Screen Size</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      options={screenSizeOptions}
                      placeholder="Select Screen Size..."
                      getOptionLabel={(option:any) => option.label}
                      getOptionValue={(option:any) => option.value}
                      onChange={handleScreenChange}
                      value={
                        screenSizeOptions.find(
                          (option) => option.value === methods.watch('size')
                        ) || null
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-3">
            <FormField
              control={methods.control}
              name="playlist_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Playlist (select screen size to populate)</FormLabel>
                  <FormControl>
                    <Select
                      isDisabled={disabledPlayList}
                      {...field}
                      options={playlistData}
                      placeholder="Select Playlist..."
                      getOptionLabel={(option:any) => option.name!}
                      getOptionValue={(option:any) =>
                        option.id ? option.id.toString() : ''
                      }
                      onChange={(selectedOption:any) => {
                        handlePlaylistChange(selectedOption);
                        methods.setValue('playlist_id', selectedOption?.id!);
                      }}
                      value={
                        playlistData.find(
                          (playlist) =>
                            playlist.id === methods.watch('playlist_id')
                        ) || null
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-3">
            <FormField
              control={methods.control}
              name="webPlayerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Web Player URL</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-3">
            <Button type="submit" disabled={loading}>
              {mode === 'add' ? 'Add TV Screen' : 'Update TV Screen'}
              {loading && <Icons.spinner className="ml-2 animate-spin" />}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ScreenInfoForm;
