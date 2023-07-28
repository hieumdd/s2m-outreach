import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import Joi from 'joi';
import ndjson from 'ndjson';

import { createLoadStream } from '../bigquery.service';
import { Pipeline } from './pipeline.const';
import { GetResourcesOptions, getResources } from '../outreach/resource.service';

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

export const runPipeline = async (pipeline_: Pipeline, options: RunPipelineOptions) => {
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
