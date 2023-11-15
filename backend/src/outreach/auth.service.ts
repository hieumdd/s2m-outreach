import axios from 'axios';

import { getSecret, setSecret } from '../secret-manager.service';

type RefreshTokenResponse = {
    access_token: string;
    refresh_token: string;
    created_at: number;
    expires_in: number;
};

export const getClient = async () => {
    const refreshTokenKey = 'outreach-refresh-token';

    const refreshToken = await getSecret(refreshTokenKey);

    const clientId = 'lyMpuSQ7SN1GA1ssaqx~mChKqzbHOZA4zT-.tb1hI7Cl';
    const clientSecret = await getSecret('outreach-client-secret');

    const { access_token, refresh_token } = await axios
        .request<RefreshTokenResponse>({
            method: 'POST',
            url: 'https://api.outreach.io/oauth/token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
                client_id: clientId,
                client_secret: clientSecret,
                redirect_url: 'https://oauth.pstmn.io/v1/browser-callback',
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            },
        })
        .then((response) => response.data);

    await setSecret(refreshTokenKey, refresh_token);

    return axios.create({
        baseURL: 'https://api.outreach.io/api/v2/',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/vnd.api+json',
        },
    });
};
