export interface Country {
  id?: number;
  iso_code?: string;
  name?: string;
  region?: string;
}

export interface State {
  id?: number;
  name?: string;
  country_id?: string;
}

export interface City {
  id?: number;
  name?: string;
  state_id?: string;
}
