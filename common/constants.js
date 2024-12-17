export const FUNNY_QUOTE_URL = process.env.NEXT_PUBLIC_FUNNY_QUOTE_URL;
export const GEOLOCATION_URL = process.env.NEXT_PUBLIC_GEOLOCATION_URL;
export const GTAG_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GTAG_MEASUREMENT_ID;
export const MEDIA_HOST = process.env.NEXT_PUBLIC_MEDIA_HOST;
export const GOOGLE_MAP_API_URL = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_URL;
export const GOOGLE_MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY
export const FACEBOOK_APP_URL= process.env.NEXT_PUBLIC_FACEBOOK_APP_URL;
export const AWS_CONFIG = {
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    s3: {
        REGION: process.env.NEXT_PUBLIC_AWS_S3_REGION,
        BUCKET: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
        BLOG_BUCKET: process.env.NEXT_PUBLIC_AWS_S3_BLOG_BUCKET,
        DOCUMENT_BUCKET: process.env.NEXT_PUBLIC_AWS_S3_DOCUMENT_BUCKET,
        MEDIA_BUCKET: process.env.NEXT_PUBLIC_AWS_S3_MEDIA_BUCKET,
        MESSAGE_BUCKET: process.env.NEXT_PUBLIC_AWS_S3_MESSAGE_BUCKET
    },
    apiGateway: {
        REGION: process.env.NEXT_PUBLIC_AWS_API_GATEWAY_REGION,
        URL: process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL,
    },
    cognito: {
        REGION: process.env.NEXT_PUBLIC_AWS_COGNITO_REGION,
        USER_POOL_ID: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
        APP_CLIENT_ID: process.env.NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID,
        IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID
    },
    social: {
        FB: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
    },
    cookie: {
        DOMAIN: process.env.NEXT_PUBLIC_AWS_COOKIE_DOMAIN,
        SECURED: process.env.NEXT_PUBLIC_AWS_COOKIE_SECURED_FLAG.toUpperCase() === 'TRUE'
    },
    oath: {
        DOMAIN: process.env.NEXT_PUBLIC_AWS_OATH_DOMAIN,
        REDIRECT_SIGN_IN: process.env.NEXT_PUBLIC_AWS_OATH_REDIRECT_SIGN_IN,
        REDIRECT_SIGN_OUT: process.env.NEXT_PUBLIC_AWS_OATH_REDIRECT_SIGN_OUT
    }
};
export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
export const INDEX_FLAG = process.env.NEXT_PUBLIC_INDEX_FLAG.toUpperCase() === 'TRUE'
export const MEASUREMENT_FLAG = process.env.NEXT_PUBLIC_MEASUREMENT_FLAG.toUpperCase() == 'TRUE'
export const RELEASE_VERSION = process.env.NEXT_PUBLIC_RELEASE_VERSION