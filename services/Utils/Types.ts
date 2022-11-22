export interface TelegramUser {
  auth_date: number;
  id: number;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  username?: string;
  hash?: string;
}

export interface TelegramUserFromAuthorizer {
  auth_date: number;
  id: number;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  username?: string;
  hash?: string;
  renewedAccessToken?: string;
}
