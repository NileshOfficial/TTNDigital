import * as dotenv from 'dotenv';
dotenv.config();

export const oAuthTokenUri = 'https://oauth2.googleapis.com/token';
export const oAuthTokenInfoUri = 'https://oauth2.googleapis.com/tokeninfo';
export const oAuthTokenRevokeUri = 'https://oauth2.googleapis.com/revoke';
export const dbConnectionUri = `mongodb+srv://nilesh:${process.env.DB_SECRET}@cluster0-4f2ih.mongodb.net/TTN_Digital?retryWrites=true&w=majority`