import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import Joi from 'joi';
import ndjson from 'ndjson';

import { logger } from '../logging.service';
import { createLoadStream } from '../bigquery.service';
import { createTasks } from '../cloud-tasks.service';
import { GetResourcesOptions, getResources } from '../outreach/resource/resource.service';
import * as pipelines from './pipeline.const';
import { getUser } from '../outreach/user/user.service';
import { getClient } from '../outreach/auth/auth.service';

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
    pipelineName: keyof typeof pipelines;
    options: GetResourcesOptions;
};
export const runPipeline = async ({ userId, pipelineName, options }: RunPipelineOptions) => {
    const pipeline_ = pipelines[pipelineName];

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
    return createTasks(
        Object.keys(pipelines).map((pipeline_) => ({ pipeline: pipeline_, start, end })),
        (task) => task.pipeline,
    );
};
