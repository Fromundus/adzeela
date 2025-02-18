export interface ScheduledSlots {
    files: File[]; 
    id?: number;
    slot_name: string;
    schedule_type: string;
    schedule_days: string;
    media_id: string;
    tv_screen_id: string;

    updated_at?: string
}