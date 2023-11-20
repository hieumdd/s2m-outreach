import * as pipelines from './pipeline.const';
import { createPipelineTasks, runPipeline } from './pipeline.service';

it('run-pipeline', async () => {
    return runPipeline({
        userId: '16d06ab5-ae10-451d-af33-53f29ff93a12',
        options: {
            start: '2022-01-01',
            end: '2023-01-01',
        },
    })
        .then((result) => {
            console.log({ result });
        })
        .catch((error) => {
            console.error({ error });
            throw error;
        });
}, 100_000_000);

describe('run-multiple-pipeline', () => {
    it.each(Object.keys(pipelines).map((_, i) => i))('$x', async (index) => {
        process.env['CLOUD_RUN_TASK_INDEX'] = `${index}`;

        return runPipeline({
            userId: '16d06ab5-ae10-451d-af33-53f29ff93a12',
            options: {
                start: '2022-01-01',
                end: '2023-01-01',
            },
        })
            .then((result) => {
                console.log({ result });
            })
            .catch((error) => {
                console.error({ error });
                throw error;
            });
    });
});
it('create-pipeline-tasks', async () => {
    return createPipelineTasks({ start: '', end: '' })
        .then((result) => expect(result).toBeDefined())
        .catch((error) => {
            console.error({ error });
            throw error;
        });
});
