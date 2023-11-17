import express from 'express';
// import nunjucks from 'nunjucks';
// import { Command } from 'commander';

import { logger } from './logging.service';
import { getAuthorizationURL } from './outreach/auth/auth.service';
import { createUser, getUsers } from './outreach/user/user.service';
import { CreatePipelineTasksSchema, RunPipelineSchema } from './pipeline/pipeline.request.dto';
import { createPipelineTasks, runPipeline } from './pipeline/pipeline.service';

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
    process.on(signal, () => {
        logger.debug({ action: 'interrupt' });
        process.exit();
    }),
);

const app = express();
// nunjucks.configure('views', { autoescape: true, express: app });
// app.set('view engine', 'html');

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

app.post('/task', ({ body }, res) => {
    CreatePipelineTasksSchema.validateAsync(body)
        .then((value) => {
            createPipelineTasks(value)
                .then((result) => res.status(200).json({ result }))
                .catch((error) => {
                    logger.error({ error });
                    res.status(500).json({ error });
                });
        })
        .catch((error) => {
            logger.error({ body, error });
            res.status(400).json({ error });
        });
});

app.listen(8080, () => {
    console.log(321);
});

// const program = new Command();

// program.command('server').action(() => {
// });

// program
//     .command('execute')
//     .requiredOption('--userId <userId>')
//     .requiredOption('--pipelineName <pipelineName>')
//     .option('--start <start>')
//     .option('--end <end>')
//     .action((args) => {
//         console.log(args);
//         RunPipelineSchema.validateAsync({
//             userId: args.userId,
//             pipelineName: args.pipelineName,
//             options: { start: args.start, end: args.end },
//         })
//             .then((request) => {
//                 runPipeline(request)
//                     .then(() => {
//                         logger.info({ action: 'done', request });
//                         process.exit(0);
//                     })
//                     .catch((error) => {
//                         logger.error({ error });
//                         process.exit(1);
//                     });
//             })
//             .catch((error) => {
//                 logger.warn({ error });
//                 process.exit(1);
//             });
//     });

// program.parse();
