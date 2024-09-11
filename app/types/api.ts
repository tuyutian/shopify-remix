export enum API_VERSION {
  V1="v1",
  NONE="none",
  SELF="self"
}

export type UserOther = {
  session_data: string[][];
  is_new_notice: boolean;
  shop: string;
  token_id: string;
  email: string;
  name: string;
  nps: {
    npsSwitch: boolean;
    token: string;
    accessTime: string;
    planDisplayName: string;
    days: number;
    installTime: number;
    lastTime: number;
  };
  help_url: {
    dashboard: string[];
    tracking_page: string[];
    orders: string[];
    notification: string[];
    setting: string[];
    faq: string[];
  };
};
