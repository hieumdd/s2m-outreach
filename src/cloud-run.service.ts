import { JobsClient } from '@google-cloud/run';

const client = new JobsClient();

export const executeJob = async (args: string[], taskCount: number) => {
    return client.runJob({
        name: `s2m-outreach-executor`,
        overrides: { containerOverrides: [{ args }], taskCount },
    });
};
