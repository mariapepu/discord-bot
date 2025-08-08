import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {UserProfile} from '../entities/UserProfile.js';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env["DB_HOST"],
    port: Number(process.env["DB_PORT"]),
    username: process.env["DB_USER"],
    password: process.env["DB_PASS"],
    database: process.env["DB_NAME"],
    synchronize: true,
    logging: false,
    entities: [UserProfile]
});
