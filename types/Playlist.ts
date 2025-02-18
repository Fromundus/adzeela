import { File } from './File';

export interface Playlist {
  id?: number;
  name: string;
  play_url?: string;

  preview_type?: string;
  count?: number;
  size?: string;
  files?: File[];
  playlist_files?: File[];
  preview?: string;
  created_at?: string;
  updated_at?: string;
}
