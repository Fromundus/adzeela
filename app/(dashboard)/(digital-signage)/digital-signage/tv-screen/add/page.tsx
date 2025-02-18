'use client';
import { Card } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { Dot } from 'lucide-react';
import ScreenInfoForm from '@/components/forms/tv-screen/screen-info-form';
import { Button } from '@/components/ui/button';
import { fetchPlaylists } from '@/app/api/playlistApi';
import { format } from 'date-fns';
import { Playlist } from '@/types/Playlist';
import TabsComponent from '@/components/TabComponent';

const AddTvScreenPage = () => {
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [rotate, setRotate] = React.useState(false);
  const [iframeUrl, setIframeUrl] = useState<string>('');

  const handleIframe = (e: any) => {
    
    const url = e+"&allow=true"
    console.log("setIframeUrl",url)
    setIframeUrl(url);
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

  useEffect(() => {
    fetchPlaylistData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3">
        <div className="m-2">
          <p className="mb-3 text-primary">Tv Screen details</p>
          <Card className="p-10">
            <div
              className={`flex items-center justify-center ${
                rotate
                  ? 'relative h-[200px] w-[300px] rotate-90'
                  : 'h-[250px] w-full'
              }`}
              style={{ overflow: 'hidden' }}
            >
              {selectedPlaylist ? (
                <iframe
                  src={iframeUrl}
                  frameBorder="0"
                  className="h-full w-full"
                  style={{
                    transformOrigin: 'center',
                    transform: rotate ? 'rotate(-90deg)' : 'none'
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
                  <div className="mt-3 flex justify-center">
                    <Button className="rounded-sm">
                      Save & push to this screen
                    </Button>
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
              setSelectedPlaylist={setSelectedPlaylist}
              setRotate={setRotate}
              mode="add"
              handleIframe={handleIframe}
            />
          </Card>
        </div>
      </div>

      <TabsComponent />
    </>
  );
};

export default AddTvScreenPage;
