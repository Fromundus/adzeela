import { File } from './File';

export interface Media {
  id?: number;
  name: string;
  type: string;
  size?: string;
  files?: File[];
  created_at?: string;
  updated_at?: string;
  displayName?: string;
  displayImage?: string;
  fileType?: string;
}
