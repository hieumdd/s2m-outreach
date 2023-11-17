import Joi from 'joi';

import { dayjs } from '../dayjs';
import { CreatePipelineTasksOptions, RunPipelineOptions } from './pipeline.service';

export const CreatePipelineTasksSchema = Joi.object<CreatePipelineTasksOptions>({
    start: Joi.string()
        .optional()
        .empty(null)
        .allow(null)
        .default(dayjs.utc().subtract(1, 'month').format('YYYY-MM-DD')),
    end: Joi.string().optional().empty(null).allow(null).default(dayjs.utc().format('YYYY-MM-DD')),
});

export const RunPipelineSchema = Joi.object<RunPipelineOptions>({
    userId: Joi.string().required(),
    options: CreatePipelineTasksSchema,
});
