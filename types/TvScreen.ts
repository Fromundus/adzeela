import { Playlist } from "./Playlist";
export interface TvScreen {
    id?: number;
    name: string;
    address: string;
    zip_code: string;
    setup: string;
    size: string;
    playlist_name: string;
    tv_screen_location: string;

    updated_at?: string
    playlist?: Playlist;
}