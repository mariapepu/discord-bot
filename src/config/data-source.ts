import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {UserProfile} from '../entities/UserProfile.js';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'prueba',
    database: 'discord-bot',
    synchronize: true,
    logging: false,
    entities: [UserProfile],
});
