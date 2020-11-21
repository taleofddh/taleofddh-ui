export const FUNNY_QUOTE_URL = 'https://www.brainyquote.com/link/quotefu.js';
export const GEOLOCATION_URL = 'https://geolocation-db.com/json/0f761a30-fe14-11e9-b59f-e53803842572/';
export const GTAG_TRACKING_ID = 'UA-183084614-1';
export const MEDIA_HOST = 'https://taleofddh.s3-eu-west-1.amazonaws.com';
export const AWS_CONFIG = {
    s3: {
        REGION: "eu-west-1",
        BUCKET: "media.taleofddh.com",
    },
    apiGateway: {
        REGION: "eu-west-1",
        URL: "https://api.taleofddh.com",
    },
    cognito: {
        REGION: "eu-west-1",
        USER_POOL_ID: "eu-west-1_9faevWd35",
        APP_CLIENT_ID: "5642rk8biiciamun2pppl6hfib",
        IDENTITY_POOL_ID: "eu-west-1:34adc005-4841-467b-861f-da971f6eaa5c"
    }
};