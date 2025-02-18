export const formatFileSize = (size: string | number): string => {
    if (typeof size === 'string') {
        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (units.some(unit => size.includes(unit))) {
            return size;
        }
    }

    const sizeInBytes = typeof size === 'number' ? size : parseFloat(size);
    if (isNaN(sizeInBytes) || sizeInBytes <= 0) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    const fileSize = sizeInBytes / Math.pow(1024, i);

    return `${fileSize.toFixed(2)} ${sizes[i]}`;
};
