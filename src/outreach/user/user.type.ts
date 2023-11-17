import { Token } from '../auth/token.type';

export type User = {
    id: string;
    name: string;
    dataset: string;
    meta: {
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
        };
    };
    token: Token;
};
