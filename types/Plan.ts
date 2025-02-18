
export interface Plan {
  id?: string;
  name: string;
  active: boolean;
  plan_details: PlanDetails;
  amount: number;
  currency?: string;
  interval?: string;
  is_current_plan: boolean;
  price_id?: string;

}

interface PlanDetails {
  max_tv_screens?: string;
  advertising?: string;
  playlist_creation?: string;
  content_scheduling?: string;
  additional_users?: string;
  analytics_insights?: string;
  support_details?: string;

  // advertising_cost?: string
  ads_limit?: string
  advertising_areas?: string
  scheduling_options?: string
  analytics_reporting?: string
  campaign_management?: string
  priority_support?: string

}


export interface PromotersPlanFeatures {
  additional_users: number;
  analytics_and_insights: string; // Use a union of possible values if known, or just string
  basic_content_scheduling: boolean;
  priority_support: string; // Union of known values, or just string
  private_advertising: boolean;
  public_advertising: boolean;
  register_tv_screen: number;
  unlimited_playlist_creation: boolean;
  // Add other properties if needed based on the full data structure
}



export interface AdvertisersPlanFeatures {
  create_ads: number;
  advertising_areas: string;
  scheduling_control: string; // Use a union of known values if possible, or just string
  unlimited_playlist_creation: boolean;
  performance_analytics_reporting:  string; // Union of known values, or just string
  campaign_management: string; // Union of known values, or just string
  priority_IT_support: string;
}