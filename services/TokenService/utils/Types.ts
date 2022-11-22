export interface TelegramUserProfile {
  id: number;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  username?: string;
  language: string;
}

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
