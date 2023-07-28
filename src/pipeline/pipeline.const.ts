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
