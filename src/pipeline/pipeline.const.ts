import JoiDefault, { NumberSchema, Schema } from 'joi';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import { GetResourcesConfig } from '../outreach/resource.service';
import { CreateLoadStreamOptions } from '../bigquery.service';

const Joi = JoiDefault.defaults((schema) => {
    switch (schema.type) {
        case 'number':
            return (schema as NumberSchema).allow(null).unsafe();
        default:
            return schema.allow(null);
    }
});

const timestampSchema = Joi.string().custom((value) => {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.toISOString() : null;
});

export type Pipeline = {
    getConfig: GetResourcesConfig;
    schema: Schema;
    loadConfig: CreateLoadStreamOptions;
};

export const Account: Pipeline = {
    getConfig: {
        url: '/accounts',
        params: () => ({}),
    },
    schema: Joi.object({
        id: Joi.number(),
        attributes: Joi.object({
            buyerIntentScore: Joi.number(),
            companyType: Joi.string(),
            createdAt: timestampSchema,
            description: Joi.string(),
            domain: Joi.string(),
            externalSource: Joi.string(),
            followers: Joi.number(),
            foundedAt: timestampSchema,
            industry: Joi.string(),
            linkedInEmployees: Joi.number(),
            linkedInUrl: Joi.string(),
            locality: Joi.string(),
            name: Joi.string(),
            named: Joi.boolean(),
            naturalName: Joi.string(),
            numberOfEmployees: Joi.number(),
            sharingTeamId: Joi.string(),
            touchedAt: timestampSchema,
            updatedAt: timestampSchema,
            websiteUrl: Joi.string(),
        }),
    }),
    loadConfig: {
        table: 'Account',
        schema: [
            { name: 'id', type: 'NUMERIC' },
            {
                name: 'attributes',
                type: 'RECORD',
                fields: [
                    { name: 'buyerIntentScore', type: 'NUMERIC' },
                    { name: 'companyType', type: 'STRING' },
                    { name: 'createdAt', type: 'TIMESTAMP' },
                    { name: 'description', type: 'STRING' },
                    { name: 'domain', type: 'STRING' },
                    { name: 'externalSource', type: 'STRING' },
                    { name: 'followers', type: 'NUMERIC' },
                    { name: 'foundedAt', type: 'TIMESTAMP' },
                    { name: 'industry', type: 'STRING' },
                    { name: 'linkedInEmployees', type: 'NUMERIC' },
                    { name: 'linkedInUrl', type: 'STRING' },
                    { name: 'locality', type: 'STRING' },
                    { name: 'name', type: 'STRING' },
                    { name: 'named', type: 'BOOLEAN' },
                    { name: 'naturalName', type: 'STRING' },
                    { name: 'numberOfEmployees', type: 'NUMERIC' },
                    { name: 'sharingTeamId', type: 'STRING' },
                    { name: 'touchedAt', type: 'TIMESTAMP' },
                    { name: 'updatedAt', type: 'TIMESTAMP' },
                    { name: 'websiteUrl', type: 'STRING' },
                ],
            },
        ],
    },
};

export const Call: Pipeline = {
    getConfig: {
        url: '/calls',
        params: () => ({}),
    },
    schema: Joi.object({
        id: Joi.number(),
        attributes: Joi.object({
            answeredAt: timestampSchema,
            completedAt: timestampSchema,
            createdAt: timestampSchema,
            dialedAt: timestampSchema,
            direction: Joi.string(),
            externalVendor: Joi.string(),
            from: Joi.string(),
            note: Joi.string(),
            outcome: Joi.string(),
            recordingUrl: Joi.string(),
            returnedAt: timestampSchema,
            sequenceAction: Joi.string(),
            shouldRecordCall: Joi.boolean(),
            state: Joi.string(),
            stateChangedAt: timestampSchema,
            to: Joi.string(),
            uid: Joi.string(),
            updatedAt: timestampSchema,
            userCallType: Joi.string(),
            vendorCallId: Joi.string(),
            voicemailRecordingUrl: Joi.string(),
        }),
    }),
    loadConfig: {
        table: 'Call',
        schema: [
            { name: 'id', type: 'NUMERIC' },
            {
                name: 'attributes',
                type: 'RECORD',
                fields: [
                    { name: 'answeredAt', type: 'TIMESTAMP' },
                    { name: 'completedAt', type: 'TIMESTAMP' },
                    { name: 'createdAt', type: 'TIMESTAMP' },
                    { name: 'dialedAt', type: 'TIMESTAMP' },
                    { name: 'direction', type: 'STRING' },
                    { name: 'externalVendor', type: 'STRING' },
                    { name: 'from', type: 'STRING' },
                    { name: 'note', type: 'STRING' },
                    { name: 'outcome', type: 'STRING' },
                    { name: 'recordingUrl', type: 'STRING' },
                    { name: 'returnedAt', type: 'TIMESTAMP' },
                    { name: 'sequenceAction', type: 'STRING' },
                    { name: 'shouldRecordCall', type: 'BOOLEAN' },
                    { name: 'state', type: 'STRING' },
                    { name: 'stateChangedAt', type: 'TIMESTAMP' },
                    { name: 'to', type: 'STRING' },
                    { name: 'uid', type: 'STRING' },
                    { name: 'updatedAt', type: 'TIMESTAMP' },
                    { name: 'userCallType', type: 'STRING' },
                    { name: 'vendorCallId', type: 'STRING' },
                    { name: 'voicemailRecordingUrl', type: 'STRING' },
                ],
            },
        ],
    },
};

export const Prospect: Pipeline = {
    getConfig: {
        url: '/prospects',
        params: () => ({}),
    },
    schema: Joi.object({
        id: Joi.number(),
        attributes: Joi.object({
            addedAt: timestampSchema,
            addressCity: Joi.string(),
            addressCountry: Joi.string(),
            addressState: Joi.string(),
            addressStreet: Joi.string(),
            addressStreet2: Joi.string(),
            addressZip: Joi.string(),
            angelListUrl: Joi.string(),
            availableAt: timestampSchema,
            callOptedOut: Joi.boolean(),
            callsOptStatus: Joi.string(),
            callsOptedAt: timestampSchema,
            campaignName: Joi.string(),
            clickCount: Joi.number(),
            company: Joi.string(),
            createdAt: timestampSchema,
            dateOfBirth: timestampSchema,
            degree: Joi.string(),
            emailOptedOut: Joi.boolean(),
            emailsOptStatus: Joi.string(),
            emailsOptedAt: timestampSchema,
            engagedAt: timestampSchema,
            engagedScore: Joi.number(),
            eventName: Joi.string(),
            externalId: Joi.string(),
            externalOwner: Joi.string(),
            externalSource: Joi.string(),
            facebookUrl: Joi.string(),
            firstName: Joi.string(),
            gender: Joi.string(),
            githubUrl: Joi.string(),
            githubUsername: Joi.string(),
            googlePlusUrl: Joi.string(),
            graduationDate: timestampSchema,
            jobStartDate: timestampSchema,
            lastName: Joi.string(),
            linkedInConnections: Joi.number(),
            linkedInId: Joi.string(),
            linkedInSlug: Joi.string(),
            linkedInUrl: Joi.string(),
            middleName: Joi.string(),
            name: Joi.string(),
            nickname: Joi.string(),
            occupation: Joi.string(),
            openCount: Joi.number(),
            optedOut: Joi.boolean(),
            optedOutAt: timestampSchema,
            personalNote1: Joi.string(),
            personalNote2: Joi.string(),
            preferredContact: Joi.string(),
            quoraUrl: Joi.string(),
            region: Joi.string(),
            replyCount: Joi.number(),
            school: Joi.string(),
            score: Joi.number(),
            sharingTeamId: Joi.string(),
            source: Joi.string(),
            specialties: Joi.string(),
            stackOverflowId: Joi.string(),
            stackOverflowUrl: Joi.string(),
            timeZone: Joi.string(),
            timeZoneIana: Joi.string(),
            timeZoneInferred: Joi.string(),
            title: Joi.string(),
            touchedAt: timestampSchema,
            trashedAt: timestampSchema,
            twitterUrl: Joi.string(),
            twitterUsername: Joi.string(),
            updatedAt: timestampSchema,
            websiteUrl1: Joi.string(),
            websiteUrl2: Joi.string(),
            websiteUrl3: Joi.string(),
        }),
    }),
    loadConfig: {
        table: 'Prospect',
        schema: [
            { name: 'id', type: 'NUMERIC' },
            {
                name: 'attributes',
                type: 'RECORD',
                fields: [
                    { name: 'addedAt', type: 'TIMESTAMP' },
                    { name: 'addressCity', type: 'STRING' },
                    { name: 'addressCountry', type: 'STRING' },
                    { name: 'addressState', type: 'STRING' },
                    { name: 'addressStreet', type: 'STRING' },
                    { name: 'addressStreet2', type: 'STRING' },
                    { name: 'addressZip', type: 'STRING' },
                    { name: 'angelListUrl', type: 'STRING' },
                    { name: 'availableAt', type: 'TIMESTAMP' },
                    { name: 'callOptedOut', type: 'BOOLEAN' },
                    { name: 'callsOptStatus', type: 'STRING' },
                    { name: 'callsOptedAt', type: 'TIMESTAMP' },
                    { name: 'campaignName', type: 'STRING' },
                    { name: 'clickCount', type: 'NUMERIC' },
                    { name: 'company', type: 'STRING' },
                    { name: 'createdAt', type: 'TIMESTAMP' },
                    { name: 'dateOfBirth', type: 'TIMESTAMP' },
                    { name: 'degree', type: 'STRING' },
                    { name: 'emailOptedOut', type: 'BOOLEAN' },
                    { name: 'emailsOptStatus', type: 'STRING' },
                    { name: 'emailsOptedAt', type: 'TIMESTAMP' },
                    { name: 'engagedAt', type: 'TIMESTAMP' },
                    { name: 'engagedScore', type: 'NUMERIC' },
                    { name: 'eventName', type: 'STRING' },
                    { name: 'externalId', type: 'STRING' },
                    { name: 'externalOwner', type: 'STRING' },
                    { name: 'externalSource', type: 'STRING' },
                    { name: 'facebookUrl', type: 'STRING' },
                    { name: 'firstName', type: 'STRING' },
                    { name: 'gender', type: 'STRING' },
                    { name: 'githubUrl', type: 'STRING' },
                    { name: 'githubUsername', type: 'STRING' },
                    { name: 'googlePlusUrl', type: 'STRING' },
                    { name: 'graduationDate', type: 'TIMESTAMP' },
                    { name: 'jobStartDate', type: 'TIMESTAMP' },
                    { name: 'lastName', type: 'STRING' },
                    { name: 'linkedInConnections', type: 'NUMERIC' },
                    { name: 'linkedInId', type: 'STRING' },
                    { name: 'linkedInSlug', type: 'STRING' },
                    { name: 'linkedInUrl', type: 'STRING' },
                    { name: 'middleName', type: 'STRING' },
                    { name: 'name', type: 'STRING' },
                    { name: 'nickname', type: 'STRING' },
                    { name: 'occupation', type: 'STRING' },
                    { name: 'openCount', type: 'NUMERIC' },
                    { name: 'optedOut', type: 'BOOLEAN' },
                    { name: 'optedOutAt', type: 'TIMESTAMP' },
                    { name: 'personalNote1', type: 'STRING' },
                    { name: 'personalNote2', type: 'STRING' },
                    { name: 'preferredContact', type: 'STRING' },
                    { name: 'quoraUrl', type: 'STRING' },
                    { name: 'region', type: 'STRING' },
                    { name: 'replyCount', type: 'NUMERIC' },
                    { name: 'school', type: 'STRING' },
                    { name: 'score', type: 'NUMERIC' },
                    { name: 'sharingTeamId', type: 'STRING' },
                    { name: 'source', type: 'STRING' },
                    { name: 'specialties', type: 'STRING' },
                    { name: 'stackOverflowId', type: 'STRING' },
                    { name: 'stackOverflowUrl', type: 'STRING' },
                    { name: 'timeZone', type: 'STRING' },
                    { name: 'timeZoneIana', type: 'STRING' },
                    { name: 'timeZoneInferred', type: 'STRING' },
                    { name: 'title', type: 'STRING' },
                    { name: 'touchedAt', type: 'TIMESTAMP' },
                    { name: 'trashedAt', type: 'TIMESTAMP' },
                    { name: 'twitterUrl', type: 'STRING' },
                    { name: 'twitterUsername', type: 'STRING' },
                    { name: 'updatedAt', type: 'TIMESTAMP' },
                    { name: 'websiteUrl1', type: 'STRING' },
                    { name: 'websiteUrl2', type: 'STRING' },
                    { name: 'websiteUrl3', type: 'STRING' },
                ],
            },
        ],
    },
};
