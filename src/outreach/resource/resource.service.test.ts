import axios from 'axios';
import { Account } from '../../pipeline/pipeline.const';
import { getResources } from './resource.service';

it('get-resources', (done) => {
    const stream = getResources(axios, Account.getConfig, {
        start: '2022-01-01',
        end: '2023-01-01',
    });

    stream.on('data', (data) => {
        console.log({ data });
    });
    stream.on('error', (error) => {
        console.error(error);
        done(error);
    });
    stream.on('end', () => {
        done();
    });
});
