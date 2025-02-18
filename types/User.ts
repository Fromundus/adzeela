export interface User {
  id?: number;
  name: string;
  email: string;
  roles: { name: string }[]; // Array of objects with a `name` property
  created_at?: string;
  updated_at?: string;
  subscriptions?: string;
  user_type?: string;
  address?: string;
  phone?: string;
  stripe_customer_id?: string;

}


export interface UserBalance {
  user_id?: string,
  current_balance?: string,
  total_revenue?: string,

}

export interface UserTransactions {
  amount?: string,
  status?: string,
  created_at?: string,
  details?: string,
}