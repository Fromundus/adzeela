import Image from 'next/image';
import { FileText } from 'lucide-react';

const FileThumbnail = ({ file }: { file: any }) => {
  const fileUrl = file ? `${process.env.NEXT_PUBLIC_API_URL}/${file.path}` : '';
  const fileType = file ? file.type : '';

  if (fileType === 'image') {
    return (
      <div className="h-24 w-24 overflow-hidden rounded-lg">
        <img
          src={file?.displayImage}
          alt={file?.displayImage}
          className="object-cover"
        />
        {/* <Image src={fileUrl} alt={file.name} width={100} height={100} className="object-cover" /> */}
      </div>
    );
  } else if (fileType === 'video') {
    return (
      <div className="relative h-24 w-24 overflow-hidden rounded-lg">
        <video
          src={file?.displayImage}
          className="h-full w-full object-cover"
          controls={false}
          muted
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  } else {
    return <FileText className="h-10 w-10 text-gray-500" />;
  }
};

export default FileThumbnail;
