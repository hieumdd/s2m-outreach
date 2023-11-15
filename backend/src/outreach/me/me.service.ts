import { AxiosInstance } from 'axios';

type GetMeResponse = {
    data: {
        id: string;
        attributes: {
            name: string;
        };
    };
    meta: {
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
        };
    };
};

export const getMe = async (client: AxiosInstance) => {
    return await client
        .request<GetMeResponse>({ method: 'GET', url: '/' })
        .then((response) => response.data);
};
