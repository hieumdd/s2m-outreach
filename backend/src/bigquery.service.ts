import { BigQuery, TableSchema } from '@google-cloud/bigquery';

import { logger } from './logging.service';

const client = new BigQuery();

export type CreateLoadStreamOptions = {
    dataset: string;
    table: string;
    schema: Record<string, any>[];
};

export const createLoadStream = async (options: CreateLoadStreamOptions) => {
    const dataset = client.dataset(options.dataset);

    await dataset.exists().then(([exist]) => (!exist ? dataset.create() : undefined));

    return client
        .dataset(options.dataset)
        .table(options.table)
        .createWriteStream({
            schema: { fields: options.schema } as TableSchema,
            sourceFormat: 'NEWLINE_DELIMITED_JSON',
            createDisposition: 'CREATE_IF_NEEDED',
            writeDisposition: 'WRITE_TRUNCATE',
        })
        .on('job', (job) => {
            logger.info({ action: 'load', table: options.table, id: job.id });
        });
};
