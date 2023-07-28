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
