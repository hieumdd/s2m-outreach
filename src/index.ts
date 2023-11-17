import express from 'express';
// import nunjucks from 'nunjucks';
// import { Command } from 'commander';

import { logger } from './logging.service';

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
