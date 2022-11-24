export interface TelegramUserProfile {
    id: number;
    first_name?: string;
    last_name?: string;
    photo_url?: string;
    username?: string;
    language: string;
    role: 'admin';
}

export type Tokens = {
    accessToken?: string;
    refreshToken?: string;
};
