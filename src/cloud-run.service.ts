import { JobsClient } from '@google-cloud/run';

const client = new JobsClient();

export const runJob = async (args: string[]) => {
    return client.runJob({
        name: `s2m-outreach-executor`,
        overrides: { containerOverrides: [{ args }] },
    });
};
