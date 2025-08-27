export interface Stats {
  users: number;
  leads: number;
  verified: number;
  offers: number;
  withdraws: number;
}

export interface Lead {
  id: string;
  created_at: string;
  offer_title: string;
  referrer_discord_id: string;
  customer_name: string;
  customer_phone: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  payout_user_paise: number;
  screenshot_url: string;
  rejection_reason?: string;
}

export interface Offer {
  id: string;
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
  discord_id: string;
  username: string;
  wallet_balance_paise: number;
}

export interface WalletTransaction {
    id: string;
    created_at: string;
    amount_paise: number;
    type: 'CREDIT' | 'DEBIT';
    note: string;
}

export interface Withdraw {
  id: string;
  created_at: string;
  user: {
    discord_id: string;
    username: string;
  };
  upi_id: string;
  amount_paise: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  note?: string;
}

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  page_count: number;
}
