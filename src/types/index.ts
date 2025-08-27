
export interface Stats {
  users: number;
  leads: number;
  verified: number;
  offers: number;
  withdraws: number;
}

export interface Lead {
  _id: string;
  created_at: string;
  offer_title: string;
  referrer_discord_id: string;
  customer_name: string;
  customer_phone: string;
  status: 'pending' | 'verified' | 'rejected';
  payout_user_paise: number;
  screenshot_url: string;
  status_reason?: string | null;
}

export interface Offer {
  _id: string;
  title: string;
  payout_user_paise: number;
  base_link: string;
  account_open_guide: string;
  image_url?: string;
  terms?: string;
  benefits?: string;
  is_active: boolean;
}

export interface User {
  _id: string;
  discord_id: string;
  username: string;
  wallet_balance_paise: number;
}

export interface WalletTransaction {
    _id: string;
    created_at: string;
    amount_paise: number;
    type: 'lead_credit' | 'manual_adjust' | 'withdraw_approved' | 'withdraw_rejected';
    note: string;
    reference_id?: string;
}

export interface Withdraw {
  _id: string;
  created_at: string;
  user: {
    discord_id: string;
    username: string;
  };
  upi_id: string;
  amount_paise: number;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
}

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  page_count?: number;
}
