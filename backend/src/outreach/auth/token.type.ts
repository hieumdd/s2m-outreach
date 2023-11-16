import { Timestamp } from '@google-cloud/firestore';

export type Token = {
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at: Timestamp;
    refresh_token: string;
    scope: string;
    created_at: number;
};
