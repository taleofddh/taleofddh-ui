export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
export const APP_LONG_NAME = process.env.NEXT_PUBLIC_APP_LONG_NAME;
export const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME;
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
export const MONTH_SHORT_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"];
export const INDEX_FLAG = process.env.NEXT_PUBLIC_INDEX_FLAG.toUpperCase() === 'TRUE'
export const HOST_NAME = process.env.NEXT_PUBLIC_HOST_NAME;
export const MEASUREMENT_FLAG = process.env.NEXT_PUBLIC_MEASUREMENT_FLAG.toUpperCase() == 'TRUE'
export const RELEASE_VERSION = process.env.NEXT_PUBLIC_RELEASE_VERSION
export const PROTECTED_ROUTES = [
    "/my-account",
    "/my-account/user-profile",
    "/my-account/event-management",
    "/my-account/event-attendance",
    "/my-account/user-management",
    "/my-account/sponsor-management",
    "/my-account/media-upload"
]

export const EVENT_REVALIDATE_PERIOD = parseInt(process.env.NEXT_PUBLIC_EVENT_REVALIDATE_PERIOD);

export const AMPLIFY_RESOURCE_CONFIG = {
    Auth: {
        Cognito: {
            userPoolId: AWS_CONFIG.cognito.USER_POOL_ID,
            userPoolClientId: AWS_CONFIG.cognito.APP_CLIENT_ID,
            identityPoolId: AWS_CONFIG.cognito.IDENTITY_POOL_ID,
            region: AWS_CONFIG.cognito.REGION,
            allowGuestAccess: 'true',
            signUpVerificationMethod: 'code',
            loginWith: {
                oauth: {
                    domain: AWS_CONFIG.oath.DOMAIN,
                    scopes: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
                    redirectSignIn: [AWS_CONFIG.oath.REDIRECT_SIGN_IN],
                    redirectSignOut: [AWS_CONFIG.oath.REDIRECT_SIGN_OUT],
                    responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
                }

            }
        },
    },
    Storage: {
        S3: {
            bucket: AWS_CONFIG.s3.MEDIA_BUCKET,
            region: AWS_CONFIG.s3.REGION,
            identityPoolId: AWS_CONFIG.cognito.IDENTITY_POOL_ID
        }
    },
    API: {
        REST: {
            findMenuList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findPromotionList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findAboutUsList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findTermsAndConditionsList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findPrivacyPolicyList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findFrequentlyAskedQuestionList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findCountryByCode: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findCountryByName: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            createAuditEntry: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            createRequest : {
                endpoint: AWS_CONFIG.apiGateway.URL + '/request',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findRequest: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/request',
                region: AWS_CONFIG.apiGateway.REGION
            },
            updateSubscription: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/request',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findAlbumList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/gallery',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findRestrictedAlbumList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/gallery',
                region: AWS_CONFIG.apiGateway.REGION
            },
            updateAlbumViewCount: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/gallery',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findAlbumPhotoList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/gallery',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findPhotoList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/gallery',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findRestrictedPhotoList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/gallery',
                region: AWS_CONFIG.apiGateway.REGION
            },
            updatePhotoViewCount: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/gallery',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findBlogList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/blog',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findCategorizedBlogList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/blog',
                region: AWS_CONFIG.apiGateway.REGION
            },
            updateBlogViewCount: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/blog',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findBlogArticleList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/blog',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findArticleList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/blog',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findArticleCommentList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/blog',
                region: AWS_CONFIG.apiGateway.REGION
            },
            addArticleComment: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/blog',
                region: AWS_CONFIG.apiGateway.REGION
            },
            getArticleDocument: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/blog',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findIdentity: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/auth',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findUser: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/auth',
                region: AWS_CONFIG.apiGateway.REGION
            },
            updateUser: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/auth',
                region: AWS_CONFIG.apiGateway.REGION
            },
            createUser: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/auth',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findUserProfile: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/auth',
                region: AWS_CONFIG.apiGateway.REGION
            },
            createUserProfile: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/auth',
                region: AWS_CONFIG.apiGateway.REGION
            },
            updateUserProfile: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/auth',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findUserRole: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/auth',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findLinkList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/link',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findTravelDocuments: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/link',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findCountryVisitStatus: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/link',
                region: AWS_CONFIG.apiGateway.REGION
            },
            getTravelDocument: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/link',
                region: AWS_CONFIG.apiGateway.REGION
            },
            findMessageList: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/admin',
                region: AWS_CONFIG.apiGateway.REGION
            },
            getEmailMessage: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/admin',
                region: AWS_CONFIG.apiGateway.REGION
            },
            processStoredMessage: {
                endpoint: AWS_CONFIG.apiGateway.URL + '/admin',
                region: AWS_CONFIG.apiGateway.REGION
            }
        }
    }
}