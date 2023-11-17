import axios from 'axios';
import { AuthorizationCode } from 'simple-oauth2';

import { Token } from './token.type';

const client = new AuthorizationCode({
    client: {
        id: process.env.OUTREACH_CLIENT_ID || '',
        secret: process.env.OUTREACH_CLIENT_SECRET || '',
    },
    auth: {
        authorizeHost: 'https://api.outreach.io/',
        authorizePath: 'oauth/authorize',
        tokenHost: 'https://api.outreach.io/',
        tokenPath: 'oauth/token',
    },
    options: { credentialsEncodingMode: 'loose' },
});

const redirectURI = `${process.env.PUBLIC_URL}/authorize/callback`;
const scope = [
    'accounts.read',
    'audits.read',
    'calls.read',
    'callDispositions.read',
    'callPurposes.read',
    'complianceRequests.read',
    'contentCategories.read',
    'contentCategoryMemberships.read',
    'contentCategoryOwnerships.read',
    'duties.read',
    'emailAddresses.read',
    'events.read',
    'favorites.read',
    'jobRoles.read',
    'mailAliases.read',
    'mailboxes.read',
    'mailings.read',
    'opportunities.read',
    'opportunityProspectRoles.read',
    'opportunityStages.read',
    'personas.read',
    'phoneNumbers.read',
    'profiles.read',
    'prospects.read',
    'recipients.read',
    'recordActorAssignments.read',
    'roles.read',
    'rulesets.read',
    'sequences.read',
    'sequenceStates.read',
    'sequenceSteps.read',
    'sequenceTemplates.read',
    'snippets.read',
    'stages.read',
    'tasks.read',
    'taskPriorities.read',
    'teams.read',
    'templates.read',
    'users.read',
    'webhooks.read',
].join(' ');

export const getAuthorizationURL = () => {
    return client.authorizeURL({ redirect_uri: redirectURI, scope });
};

export const exchangeCodeForToken = async (code: string) => {
    const { token } = await client.getToken({ code, redirect_uri: redirectURI });

    return token as Token;
};

export const ensureToken = async (token: Token, callback: (token: Token) => Promise<any>) => {
    const existingToken = client.createToken({ ...token, expires_at: token.expires_at.toDate() });

    if (existingToken.expired()) {
        const newToken = await existingToken.refresh();
        callback(<Token>newToken.token);
        return newToken;
    }

    return existingToken;
};

export const getClient = (token: string) => {
    return axios.create({
        baseURL: 'https://api.outreach.io/api/v2/',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/vnd.api+json',
        },
    });
};
