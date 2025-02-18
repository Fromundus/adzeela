import { Folder } from 'lucide-react';
import FileThumbnail from './FileThumbnail';
import Image from 'next/image';

const FolderView = ({ files }: { files: any[] }) => {
    return (
        <div className="relative w-24 h-24 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
            <Image
                src="/media/images/folder.png"
                alt="Folder"
                width={100}
                height={100}
            />
            {files.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <FileThumbnail file={files[0]} />
                </div>
            )}
        </div>
    );
};

export default FolderView;
