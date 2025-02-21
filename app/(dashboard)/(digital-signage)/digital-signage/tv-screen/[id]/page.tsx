'use client';
import React, { useEffect, useState } from 'react';
import { Dot } from 'lucide-react';
import ScreenInfoForm from '@/components/forms/tv-screen/screen-info-form';
import { Button } from '@/components/ui/button';
import { fetchPlaylists } from '@/app/api/playlistApi';
import { fetchTvScreenById } from '@/app/api/tvScreenApi';
import { format } from 'date-fns';
import { Playlist } from '@/types/Playlist';
import TabsComponent from '@/components/TabComponent';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { TvScreen, TvScreenAds } from '@/types/TvScreen';

const EditTvScreenPage = () => {
  const { id } = useParams();
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);
  const [tvScreen, setTvScreen] = useState<TvScreen>();
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [tvScreenId, setTvScreenId] = useState<number | null>(null);
  const [rotate, setRotate] = React.useState(false);
  const [selectedOrientation, setSelectedOrientation] = useState<string>('');
  const [iframeUrl, setIframeUrl] = useState<string>('');

  const handleIframe = (e: any) => {
    setIframeUrl(e);
  };

  //   useEffect(() => {
  //     console.log(iframeUrl);
  //   }, [iframeUrl]);

  useEffect(() => {
    if (id) {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        setTvScreenId(numericId);
        fetchTvScreenDetails(numericId);
      }
    }
  }, [id]);

  const fetchTvScreenDetails = async (tvScreenId: number) => {
    try {
      const response = await fetchTvScreenById(tvScreenId);

      setTvScreen(response.data);

      console.log('playlist', response.data.playlist);

      const playlist = response.data.playlist;
      if (playlist) {
        setSelectedPlaylist(playlist);
      } else {
        setSelectedPlaylist(null);
      }
      // console.log("selectedPlaylist", selectedPlaylist)
    } catch (error) {
      console.error('Error fetching TV screen details:', error);
    }
  };

  const fetchPlaylistData = () => {
    fetchPlaylists()
      .then((response) => {
        setPlaylistData(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching playlists:', error);
      });
  };

  const formatDate = () => {
    if (selectedPlaylist?.updated_at) {
      const newDate = new Date(selectedPlaylist.updated_at);
      return format(newDate, 'MMM d, yyyy hh:mm a');
    }
    return '';
  };

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3">
        <div className="m-2">
          <p className="mb-3 text-primary">TV Screen details</p>

          {/* <Card className="p-10">
                        <div className="h-[230px]">
                            {selectedPlaylist ? (
                                <iframe
                                    src={selectedPlaylist.play_url || 'about:blank'}
                                    frameBorder="0"
                                    className="h-full w-full"
                                    title="Playlist Preview"
                                />
                            ) : (
                                <div className="align-center flex h-full justify-center bg-[#d9d9d9]">
                                    <div className="flex justify-center">
                                        <p className="m-auto rounded-xl bg-white p-3 px-5">
                                            No Preview Available
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {selectedPlaylist ? (
                            <>
                                <div className="mt-3 flex justify-between">
                                    <span>
                                        {formatDate()}
                                    </span>
                                    <span className="flex text-[#67c66b]">
                                        <Dot />
                                        Active now
                                    </span>
                                </div>
                                <div className="mt-3 flex justify-center">
                                    <Button className="rounded-sm">
                                        Save & push to this screen
                                    </Button>
                                </div>
                            </>
                        ) : null}
                    </Card> */}

          <Card className="p-10">
            <div
              className={`flex h-[250px] w-full
                   items-center justify-center`}
              style={{ overflow: 'hidden' }}
            >
              {iframeUrl ? (
                <iframe
                  src={iframeUrl || 'about:blank'}
                  frameBorder="0"
                  className="h-full w-full"
                  style={{
                    transformOrigin: 'center',
                    transform: rotate ? 'rotate(90deg)' : 'none'
                  }}
                />
              ) : (
                <div className="align-center flex h-full justify-center bg-[#d9d9d9]">
                  <div className="flex justify-center">
                    <p className="m-auto rounded-xl bg-white p-3 px-5">
                      No Preview Available
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div>
              {selectedPlaylist ? (
                <>
                  <div className="mt-3 flex justify-between">
                    <span>{formatDate()}</span>
                    <span className="flex text-[#67c66b]">
                      <Dot />
                      Active now
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          </Card>
        </div>
        <div className="col-span-2 m-2">
          <p className="mb-3 text-primary">Screen info</p>

          <Card className="max-h-[400px] overflow-auto p-10">
            <ScreenInfoForm
              playlists={playlistData}
              setSelectedPlaylist={setSelectedPlaylist}
              setRotate={setRotate}
              mode="edit"
              tvScreenId={tvScreenId!}
              deviceId={tvScreen?.device_id!}
              handleIframe={handleIframe}
            />
          </Card>
        </div>
      </div>
      <TabsComponent tvScreenId={tvScreenId!} />
    </>
  );
};

export default EditTvScreenPage;
