import axios from 'axios';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { getSecret } from '../secret-manager.service';

type GetTokenResponse = { data: { meta: { accessToken: string } } };

export const getClient = async () => {
    const GUID = '081b4a46-633f-4c6a-8628-09ccdb405d05';
    const INSTALL_ID = 'eeaf9580-7a7c-4acd-9915-ecbfa8aa2f43';
    const privateKey = await getSecret('outreach-private-key');

    const s2Token = jwt.sign(
        {
            iat: dayjs.utc().unix(),
            exp: dayjs.utc().add(1, 'hour').unix(),
            iss: GUID,
        },
        privateKey,
        { algorithm: 'RS256' },
    );

    const token = await axios
        .request<GetTokenResponse>({
            method: 'POST',
            url: `https://accounts.outreach.io/api/installs/${INSTALL_ID}/actions/accessToken`,
            headers: { Authorization: `Bearer ${s2Token}` },
        })
        .then((response) => response.data.data.meta.accessToken);

    return axios.create({
        baseURL: 'https://api.outreach.io/api/v2/',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/vnd.api+json' },
    });
};
