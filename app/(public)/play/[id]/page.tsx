'use client'; // Ensure this is a client-side component

import { fetchAllFilesViaMedias, fetchPlaylistMedia, fetchSchedule } from '@/app/api/playlistApi';
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useEffect, useState } from 'react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useSearchParams } from 'next/navigation'; // Use useSearchParams
import { useToast } from '@/components/ui/use-toast';
import Echo from "laravel-echo";
import Pusher from "pusher-js";

const Page = ({ params }: { params: any }) => {
  const [tvScreen, setTvScreen] = useState<any>([]);
  const [mediaFiles, setMediaFiles] = useState<any>([]);
  const [schedules, setschedules] = useState<any>([]);
  const [medias, setmedias] = useState<any>([]);
  const [files, setfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unAuthorized, setunAuthorized] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [message, setMessage] = useState('No Preview Available');
  const [swiperRef, setSwiperRef] = useState<any>(null);

  const searchParams = useSearchParams();
  const orientation = searchParams.get('orientation'); // Fetch query parameter
  const tv_id = searchParams.get('tv'); // Fetch query parameter
  const allow = searchParams.get('allow'); // Fetch query parameter
  const shouldRotate = orientation?.toLowerCase() === 'portrait';
  const { toast } = useToast();

  // // Get the orientation from query parameters
  // const orientation = typeof window !== 'undefined'
  //   ? new URLSearchParams(window.location.search).get('orientation')
  //   : null;
  const setDataFiles = (fetchedData:any) => {
    var data = fetchedData.map((media: any) => ({
      ...media,
      delay: media.type == 'video' ? null : media.duration || 3000, // Set delay to null for videos initially
    }));
    if (data.length > 0) {
      
      var updatedMediaFiles: any = [...data];
      data.forEach((media: any, index: number) => {
        if (media.type === 'video') {
          const videoElement = document.createElement('video');
          videoElement.src = media.displayImage;
          videoElement.addEventListener('loadedmetadata', () => {
            updatedMediaFiles[index].delay = Math.ceil(videoElement.duration * 1000); // Convert duration to milliseconds
            
          });
        }
      });
      setMediaFiles(updatedMediaFiles)
    }
  }
  const getPlaylistMedia = () => {
    let deviceId = localStorage.getItem('device_id');
    fetchPlaylistMedia(params.id, tv_id, deviceId, allow)
      .then((res) => {
        setTvScreen(res.data?.data);
        // setMediaFiles(res.data?.data?.playlist_files.map((media: any) => ({
        //   ...media,
        //   delay: media.type === 'video' ? null : media.duration || 3000, // Set delay to null for videos initially
        // })));
        setDataFiles(res.data?.data?.playlist_files)

        setLoading(false);
        getSchedule();
        // setunAuthorized(false);
      })
      .catch((err) => {
        setLoading(false);
        setunAuthorized(true);
        setMessage('This device might not registered')
        toast({
          title: 'Error',
          description: err.message ? err.message : 'Can`t find the device',
          variant: 'destructive'
        });
      });
  };
  const getSchedule = () => {
    fetchSchedule()
      .then((res) => {
        setschedules(res?.data?.schedule_slots)
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.message ? err.message : 'Error',
          variant: 'destructive'
        });
      });
  };

  useEffect(() => {

    if (schedules) {
      var all_media = []
      for (let index = 0; index < schedules.length; index++) {

        const tv_screen_id = schedules[index]?.tv_screen_id
        const media_id = schedules[index].media_id
        const arr_tv_screen_id = tv_screen_id.split(",");
        // Check if the ID is in the array

        if (arr_tv_screen_id.includes(tv_id)) {
          all_media.push(media_id)
        } else {
        }
        // get the  tv_screen_id
        // convert it to array
        // check if tv id is in the array
        // if tv id is in the array get the media id and table id
      }

      setmedias(all_media)
    }
  }, [schedules])

  useEffect(() => {

    if (medias && medias.length > 0) {
      fetchAllFilesViaMedias(medias)
        .then((res) => {
          if (res && res.data && res.data.files) {
            setfiles(res.data.files)
          }
        })
        .catch((err) => {
          toast({
            title: 'Error',
            description: err.message ? err.message : 'Error',
            variant: 'destructive'
          });
        });
    }
  }, [medias])

  useEffect(() => {

    if (files && files.length > 0 && !unAuthorized) {
      for (let index = 0; index < files.length; index++) {
        const element:any = files[index];
        const find = mediaFiles.find((mediaFile: any) => mediaFile.id == element?.id)
        if (!find) {
          mediaFiles.push(element); 
        }

      }
      if (refresh) {
        window.location.reload()
      }
      setDataFiles(mediaFiles)
      // setMediaFiles([...mediaFiles]);

    }
  }, [files])

  useEffect(() => {
    getPlaylistMedia();

    // Configure Laravel Echo with Pusher
    window.Pusher = Pusher;

    const echo = new Echo({
      broadcaster: "pusher",
      key: "bf8161f035227566ce8c", // Replace with your Pusher app key
      cluster: "ap1", // Replace with your Pusher cluster
      forceTLS: true, // Ensure secure connection
    });

    // Subscribe to the notifications channel
    echo.channel("notifications").listen("HourlyApiCallEvent", () => {
      getSchedule();
      setrefresh(true)
    });

    // Cleanup the connection when the component unmounts
    return () => {
      echo.disconnect();
    };
  }, []);


  useEffect(() => {
    // Retrieve video durations after mediaFiles are loaded
    if (mediaFiles.length > 0) {
    //   const updatedMediaFiles = [...mediaFiles];
    //   mediaFiles.forEach((media, index) => {
    //     if (media.type === 'video') {
    //       const videoElement = document.createElement('video');
    //       videoElement.src = media.displayImage;
    //       videoElement.addEventListener('loadedmetadata', () => {
    //         updatedMediaFiles[index].delay = Math.ceil(videoElement.duration * 1000); // Convert duration to milliseconds
    //         setMediaFiles([...updatedMediaFiles]);
    //       });
    //     }
    //   });
    }
  }, [mediaFiles]);

  // Helper function to determine the rotation style based on screen orientation
  const getRotationStyle = (media: any) => {
    const mOrienation = media.orientation.toLowerCase();
    const oOrientation = orientation?.toLowerCase();
    if (
      (mOrienation === 'landscape' && oOrientation === 'portrait') ||
      (mOrienation === 'portrait' && oOrientation === 'landscape')
    ) {
      return 'rotate-90'; // Rotate to match the screen orientation
    } else {
      return ''; // No rotation needed for square or matching orientation
    }
  };

  const handleSlideChange = (swiper: any) => {
    const currentSlideIndex = swiper.activeIndex;
    const currentMedia = mediaFiles[currentSlideIndex];
    
    if (swiper && currentMedia?.delay) {
      swiper.params.autoplay.delay = currentMedia.delay;
      swiper.autoplay.start();
    }else{
      swiper.params.autoplay.delay = 3000;
      swiper.autoplay.start();
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-black">
      {loading ? (
        <div>Loading...</div>
      ) : mediaFiles?.length !== 0 ? (
        <Swiper
          className="align-center flex h-screen w-screen items-center"
          modules={[Autoplay]}
          autoplay={{ delay: mediaFiles[0]?.delay || 3000, disableOnInteraction: false }}
          slidesPerView={1}
          onSlideChange={handleSlideChange}
          onSwiper={setSwiperRef}
        >
          {mediaFiles?.map((media: any) => {
            const rotationClass = getRotationStyle(media);
            return (
              <SwiperSlide
                key={media.id}
                className={`swiper-no-swiping flex items-center justify-center ${rotationClass}`}
              >
                {media?.type === 'image' ? (
                  <div className='image-container'>
                    <img
                      src={media?.displayImage}
                      alt={media?.name}
                      className={`${shouldRotate ? 'rotated-image' : 'h-screen w-screen object-cover'}`}
                    />
                  </div>
                ) : (
                  <video
                    src={media?.displayImage}
                    autoPlay={true}
                    muted
                    loop
                    className={`h-full w-full object-cover ${rotationClass}`}
                  />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <p className="m-auto rounded-xl bg-white p-3 px-5">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
