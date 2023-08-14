import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Joi from 'joi';

import * as pipelines from './pipeline.const';
import { RunPipelineOptions } from './pipeline.service';

dayjs.extend(utc);

export const RunPipelinesSchema = Joi.object<RunPipelineOptions>({
    start: Joi.string()
        .optional()
        .empty(null)
        .allow(null)
        .default(dayjs.utc().subtract(1, 'month').format('YYYY-MM-DD')),
    end: Joi.string().optional().empty(null).allow(null).default(dayjs.utc().format('YYYY-MM-DD')),
});

export const RunPipelineSchema = RunPipelinesSchema.append<
    RunPipelineOptions & { pipeline: keyof typeof pipelines }
>({
    pipeline: Joi.string().valid(...Object.keys(pipelines)),
});
