import { Readable } from 'node:stream';
import axios, { AxiosInstance } from 'axios';

import { logger } from '../../logging.service';

export type GetResourcesConfig = {
    url: string;
    params: (start: string, end: string) => object;
};

export type GetResourcesOptions = {
    start: string;
    end: string;
};

type GetResourcesResponse = {
    data: any[];
    links?: { next?: string };
};

export const getResources = (client: AxiosInstance, config: GetResourcesConfig, options: GetResourcesOptions) => {
    const stream = new Readable({ objectMode: true, read: () => {} });

    const _get = (offset = 0) => {
        const count = 1000;

        client
            .request<GetResourcesResponse>({
                url: config.url,
                params: {
                    ...config.params(options.start, options.end),
                    count: false,
                    'page[limit]': count,
                    'page[offset]': offset,
                },
            })
            .then((response) => response.data)
            .then(({ data, links }) => {
                data.forEach((row) => stream.push(row));
                links?.next ? _get(offset + count) : stream.push(null);
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    logger.error(error.response?.data);
                }
                stream.emit('error', error);
            });
    };

    _get();

    return stream;
};
