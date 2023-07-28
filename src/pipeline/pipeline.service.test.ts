import * as pipelines from './pipeline.const';
import { runPipeline } from './pipeline.service';

it('run-pipeline', async () => {
    return runPipeline(pipelines.Call, { start: '2022-01-01', end: '2023-01-01' })
        .then((result) => {
            console.log({ result });
        })
        .catch((error) => {
            console.error({ error });
            throw error;
        });
}, 100_000_000);
