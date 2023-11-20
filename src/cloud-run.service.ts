import { JobsClient } from '@google-cloud/run';

const client = new JobsClient();

export const executeJob = async (args: string[], taskCount: number) => {
    const projectId = await client.getProjectId();

    return await client.runJob({
        name: client.jobPath(projectId, 'us-central1', 's2m-outreach-executor'),
        overrides: { containerOverrides: [{ args }], taskCount },
    });
};
