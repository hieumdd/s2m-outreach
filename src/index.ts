import express from 'express';
import { http } from '@google-cloud/functions-framework';

import { logger } from './logging.service';
import { RunPipelinesSchema, RunPipelineSchema } from './pipeline/pipeline.request.dto';
import * as pipelines from './pipeline/pipeline.const';
import { createPipelineTasks, runPipeline } from './pipeline/pipeline.service';

const app = express();

app.post('/task', ({ body }, res) => {
    const { value, error } = RunPipelinesSchema.validate(body);

    if (error) {
        logger.error({ body, error });
        res.status(400).json({ error });
        return;
    }

    createPipelineTasks(value)
        .then((result) => {
            res.status(200).json({ result });
        })
        .catch((error) => {
            logger.error({ error });
            res.status(500).json({ error });
        });
});

app.post('/', ({ body }, res) => {
    const { value, error } = RunPipelineSchema.validate(body);

    if (error) {
        logger.error({ body, error });
        res.status(400).json({ error });
        return;
    }

    runPipeline(pipelines[value.pipeline], value)
        .then((result) => {
            res.status(200).json({ result });
        })
        .catch((error) => {
            logger.error({ error });
            res.status(500).json({ error });
        });
});

http('main', app);
