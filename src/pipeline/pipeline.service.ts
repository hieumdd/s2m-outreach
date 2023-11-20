import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import Joi from 'joi';
import ndjson from 'ndjson';

import { logger } from '../logging.service';
import { createLoadStream } from '../bigquery.service';
import { executeJob } from '../cloud-run.service';
import { Subcommand } from '../subcommand.enum';
import { getClient } from '../outreach/auth/auth.service';
import { GetResourcesOptions, getResources } from '../outreach/resource/resource.service';
import { getUser, getUsers } from '../outreach/user/user.service';
import * as pipelines from './pipeline.const';

const transformValidation = (schema: Joi.Schema) => {
    return new Transform({
        objectMode: true,
        transform: (row: any, _, callback) => {
            schema
                .validateAsync(row, { stripUnknown: true, abortEarly: false })
                .then((value) => callback(null, value))
                .catch((error) => callback(error));
        },
    });
};

export type RunPipelineOptions = {
    userId: string;
    options: GetResourcesOptions;
};
export const runPipeline = async ({ userId, options }: RunPipelineOptions) => {
    const pipeline_ = Object.values(pipelines)[parseInt(process.env.CLOUD_RUN_TASK_INDEX || '0')];

    logger.info({ action: 'start', pipeline: pipeline_.loadConfig.table });

    const user = await getUser(userId);
    const client = getClient(user.token.access_token);

    return pipeline(
        getResources(client, pipeline_.getConfig, options),
        transformValidation(pipeline_.schema),
        ndjson.stringify(),
        await createLoadStream({
            dataset: user.dataset,
            table: `p_${pipeline_.loadConfig.table}`,
            schema: pipeline_.loadConfig.schema,
        }),
    ).then(() => ({ table: pipeline_.loadConfig.table }));
};

export type CreatePipelineTasksOptions = GetResourcesOptions;

export const createPipelineTasks = async ({ start, end }: CreatePipelineTasksOptions) => {
    const users = await getUsers();

    return await Promise.all(
        users.map((user) => {
            return executeJob(
                [Subcommand.Execute, '--userId', user.id, '--start', start, '--end', end],
                Object.values(pipelines).length,
            );
        }),
    );
};
