import { runPipeline } from './pipeline.service';

it('run-pipeline', async () => {
    return runPipeline({
        userId: '16d06ab5-ae10-451d-af33-53f29ff93a12',
        pipelineName: 'Account',
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
