import * as dotenv from 'dotenv';
dotenv.config();

export const APP_CONFIG = {
    PORT: process.env.PORT || 3000,
    API_PREFIX: process.env.API_PREFIX,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
}



