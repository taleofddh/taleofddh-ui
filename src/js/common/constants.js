export const FUNNY_QUOTE_URL = process.env.REACT_APP_FUNNY_QUOTE_URL;
export const GEOLOCATION_URL = process.env.REACT_APP_GEOLOCATION_URL;
export const GTAG_TRACKING_ID = process.env.REACT_APP_GTAG_TRACKING_ID;
export const MEDIA_HOST = process.env.REACT_APP_MEDIA_HOST;
export const AWS_CONFIG = {
    s3: {
        REGION: process.env.REACT_APP_AWS_S3_REGION,
        BUCKET: process.env.REACT_APP_AWS_S3_BUCKET,
    },
    apiGateway: {
        REGION: process.env.REACT_APP_AWS_API_GATEWAY_REGION,
        URL: process.env.REACT_APP_AWS_API_GATEWAY_URL,
    },
    cognito: {
        REGION: process.env.REACT_APP_AWS_COGNITO_REGION,
        USER_POOL_ID: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
        APP_CLIENT_ID: process.env.REACT_APP_AWS_COGNITO_APP_CLIENT_ID,
        IDENTITY_POOL_ID: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID
    }
};