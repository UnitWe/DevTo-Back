import { Sequelize } from 'sequelize-typescript';

import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../../constants';
import { databaseConfig } from '../configs/database.config';
import { User } from '../../../modules/user/model/user.model';
import { Publication } from '../../../modules/publication/model/publication.model';
import { Comment } from '../../../modules/comment/model/comment.model';


export const databaseProviders = [{
    provide: SEQUELIZE,
    useFactory: async () => {
        let config;
        switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
           config = databaseConfig.development;
           break;
        case TEST:
           config = databaseConfig.test;
           break;
        case PRODUCTION:
           config = databaseConfig.production;
           break;
        default:
           config = databaseConfig.development;
        }
        const sequelize = new Sequelize(config);
        sequelize.addModels([User, Publication, Comment]);
        await sequelize.sync({ force: false });
        return sequelize;
    },
}];