export interface File {
    id?: number;
    media_id: number;
    name: string;
    type: string;
    size: string;
    mime_type: string;
    path: string;
    created_at?: string;
    updated_at?: string;

    displayImage?: string;
}