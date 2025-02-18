import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { File } from '@/types/File';
import SwiperCore, { Swiper as SwiperType } from 'swiper';

interface MediaCarouselDialogProps {
  fileItems: File[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  autoplay?: boolean;
}

export const MediaCarouselDialog: React.FC<MediaCarouselDialogProps> = ({
  fileItems,
  isOpen,
  onOpenChange,
  autoplay = false
}) => {
  const [mediaDimensions, setMediaDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (fileItems.length > 0) {
      const img = new Image();
      img.src = fileItems[0].displayImage ?? '';
      img.onload = () => {
        setMediaDimensions({ width: img.width, height: img.height });
      };
    }
  }, [fileItems]);

  const handleSlideChange = (swiper: SwiperType) => {
    videoRefs.current.forEach((video) => {
      if (video && !video.paused) {
        video.pause();
      }
    });
  };

  const dialogContentStyle = mediaDimensions
    ? {
        width: '100vw',
        height: 'auto',
        margin: 'auto'
      }
    : {};

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        style={dialogContentStyle}
        className="m-0 overflow-hidden p-0"
      >
        <Swiper
          modules={[Navigation, ...(autoplay ? [] : [Pagination]), Autoplay]}
          navigation
          pagination={autoplay ? false : { clickable: true }}
          autoplay={autoplay ? { delay: 500 } : false}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          className="bg-dark h-full w-full"
          onSlideChange={(swiper) => handleSlideChange(swiper)}
        >
          {fileItems.map((item, index) => (
            <SwiperSlide
              key={index}
              className="!flex h-full w-full items-center justify-center !bg-black"
            >
              {item.type === 'image' ? (
                <img
                  src={item.displayImage}
                  alt={item.name}
                  className="h-auto w-full object-cover"
                />
              ) : (
                <video
                ref={(el) => {
                  videoRefs.current[index] = el; // Assign to the ref array
                }}
                  controls
                  className="h-full w-full object-cover"
                  width="320"
                  height="240"
                >
                  <source src={item.displayImage} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </DialogContent>
    </Dialog>
  );
};
