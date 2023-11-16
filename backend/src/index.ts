import express from 'express';
import nunjucks from 'nunjucks';
import { Command } from 'commander';

import { logger } from './logging.service';
import { getAuthorizationURL } from './outreach/auth/auth.service';
import { createUser, getUsers } from './outreach/user/user.service';
import { CreatePipelineTasksSchema, RunPipelineSchema } from './pipeline/pipeline.request.dto';
import * as pipelines from './pipeline/pipeline.const';
import { createPipelineTasks, runPipeline } from './pipeline/pipeline.service';

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
    process.on(signal, () => {
        logger.debug({ action: 'interrupt' });
        process.exit();
    }),
);

const program = new Command();

program.command('server').action(() => {
    const app = express();
    nunjucks.configure('views', { autoescape: true, express: app });
    app.set('view engine', 'html');

    app.use(({ headers, path, body }, _, next) => {
        logger.info({ headers, path, body });
        next();
    });

    app.get('/authorize/callback', ({ query }, res) => {
        createUser(<string>query.code)
            .then((user) => res.status(200).json({ user }))
            .catch((error) => {
                logger.error({ error });
                res.status(500).json({ error });
            });
    });

    app.get('/authorize', (_, res) => {
        res.redirect(getAuthorizationURL());
    });

    app.get('/user', (_, res) => {
        getUsers()
            .then((users) => res.render('user.html', { users: JSON.stringify(users, null, 2) }))
            .catch((error) => {
                logger.error({ error });
                res.status(500).json({ error: error });
            });
    });

    app.listen('8080');
});

program.parse();

// app.post('/task', ({ body }, res) => {
//     const { value, error } = RunPipelinesSchema.validate(body);

//     if (error) {
//         logger.error({ body, error });
//         res.status(400).json({ error });
//         return;
//     }

//     createPipelineTasks(value)
//         .then((result) => {
//             res.status(200).json({ result });
//         })
//         .catch((error) => {
//             logger.error({ error });
//             res.status(500).json({ error });
//         });
// });

// app.post('/', ({ body }, res) => {
//     const { value, error } = RunPipelineSchema.validate(body);

//     if (error) {
//         logger.error({ body, error });
//         res.status(400).json({ error });
//         return;
//     }

//     runPipeline(pipelines[value.pipeline], value)
//         .then((result) => {
//             res.status(200).json({ result });
//         })
//         .catch((error) => {
//             logger.error({ error });
//             res.status(500).json({ error });
//         });
// });
