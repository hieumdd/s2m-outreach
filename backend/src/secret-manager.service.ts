import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export const getSecret = async (name: string) => {
    return client
        .getProjectId()
        .then((projectId) => `projects/${projectId}/secrets/${name}/versions/latest`)
        .then((path) => client.accessSecretVersion({ name: path }))
        .then(([res]) => res.payload?.data?.toString() || '');
};

export const setSecret = async (name: string, value: string) => {
    const payload = { data: Buffer.from(value, 'utf-8') };

    return client
        .getProjectId()
        .then((projectId) => `projects/${projectId}/secrets/${name}`)
        .then((parent) => {
            return client.addSecretVersion({ parent, payload });
        });
};
