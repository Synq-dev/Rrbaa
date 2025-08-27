
export interface Stats {
  users: number;
  leads: number;
  verified: number;
  offers: number;
  withdraws: number;
}

export interface Lead {
  _id: string;
  offer_id: string;
  offer_title: string;
  referrer_discord_id: string;
  customer_name: string;
  customer_phone: string;
  screenshot_url?: string | null;
  status: 'pending' | 'verified' | 'rejected';
  status_reason?: string | null;
  payout_user_paise: number;
  referral_link_used?: string | null;
  submitted_via?: string | null;
  created_at: string;
  updated_at: string;
  verified_by?: string | null;
  verified_at?: string | null;
}

export interface Offer {
  _id: string;
  title: string;
  payout_user_paise: number;
  base_link: string;
  account_open_guide: string;
  image_url?: string | null;
  terms?: string | null;
  benefits?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface User {
  _id: string;
  discord_id: string;
  username?: string | null;
  wallet_balance_paise: number;
  created_at: string;
}

export interface WalletTransaction {
    _id: string;
    user_discord_id: string;
    amount_paise: number;
    type: 'lead_credit' | 'manual_adjust' | 'withdraw_approved' | 'withdraw_rejected';
    reference_id?: string | null;
    created_at: string;
    note?: string | null;
}

export interface Withdraw {
  _id: string;
  user_discord_id: string;
  upi: string;
  amount_paise: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  processed_by?: string | null;
  processed_at?: string | null;
  note?: string | null;
}

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
}
