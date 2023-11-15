import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import Joi from 'joi';
import ndjson from 'ndjson';

import { logger } from '../logging.service';
import { createLoadStream } from '../bigquery.service';
import { createTasks } from '../cloud-tasks.service';
import { GetResourcesOptions, getResources } from '../outreach/resource/resource.service';
import * as pipelines from './pipeline.const';

const transformValidation = (schema: Joi.Schema) => {
    return new Transform({
        objectMode: true,
        transform: (row: any, _, callback) => {
            const { value, error } = schema.validate(row, {
                stripUnknown: true,
                abortEarly: false,
            });
            if (error) {
                callback(error);
                return;
            }
            callback(null, value);
        },
    });
};

export type RunPipelineOptions = GetResourcesOptions;

export const runPipeline = async (pipeline_: pipelines.Pipeline, options: RunPipelineOptions) => {
    logger.info({ action: 'start', pipeline: pipeline_.loadConfig.table });

    const stream = await getResources(pipeline_.getConfig, options);

    return pipeline(
        stream,
        transformValidation(pipeline_.schema),
        ndjson.stringify(),
        createLoadStream({
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
