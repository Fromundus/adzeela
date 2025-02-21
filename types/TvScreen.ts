import { Playlist } from './Playlist';
export interface TvScreen {
  id?: number;
  name: string;
  address: string;
  zip_code: string;
  setup: string;
  size: string;
  playlist_name: string;
  tv_screen_location: string;
  device_id?: string;
  updated_at?: string;
  playlist?: Playlist;
}

export interface TvScreenAds {
  slot_name: string;
  schedule_days: string;
  schedule_type: string;
  tv_screen_id: string;
}
