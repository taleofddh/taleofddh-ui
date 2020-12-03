import React from 'react';
import ReactDOM from 'react-dom';
import { Auth, Amplify } from 'aws-amplify';
import { AWS_CONFIG } from './js/common/constants';
import App from './js/app';
import reportwebvitals from './js/common/reportwebvitals';

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: AWS_CONFIG.cognito.REGION,
        userPoolId: AWS_CONFIG.cognito.USER_POOL_ID,
        identityPoolId: AWS_CONFIG.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: AWS_CONFIG.cognito.APP_CLIENT_ID
    },
    Storage: {
        region: AWS_CONFIG.s3.REGION,
        bucket: AWS_CONFIG.s3.BUCKET,
        identityPoolId: AWS_CONFIG.cognito.IDENTITY_POOL_ID
    },
    API: {
        endpoints: [
            {
                name: 'findMenuList',
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findPromotionList',
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findAboutUsList',
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findTermsAndConditionsList',
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findPrivacyPolicyList',
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findFrequentlyAskedQuestionList',
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findCountryByCode',
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findCountryByName',
                endpoint: AWS_CONFIG.apiGateway.URL + '/core',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'createRequest',
                endpoint: AWS_CONFIG.apiGateway.URL + '/request',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findRequest',
                endpoint: AWS_CONFIG.apiGateway.URL + '/request',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'updateSubscription',
                endpoint: AWS_CONFIG.apiGateway.URL + '/request',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findAlbumList',
                endpoint: AWS_CONFIG.apiGateway.URL + '/gallery',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findRestrictedAlbumList',
                endpoint: AWS_CONFIG.apiGateway.URL + '/gallery',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findPhotoList',
                endpoint: AWS_CONFIG.apiGateway.URL + '/gallery',
                region: AWS_CONFIG.apiGateway.REGION,
            },
            {
                name: 'findRestrictedPhotoList',
                endpoint: AWS_CONFIG.apiGateway.URL + '/gallery',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findBlogList',
                endpoint: AWS_CONFIG.apiGateway.URL + '/blog',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findCategorizedBlogList',
                endpoint: AWS_CONFIG.apiGateway.URL + '/blog',
                region: AWS_CONFIG.apiGateway.REGION
            },
            {
                name: 'findArticleList',
                endpoint: AWS_CONFIG.apiGateway.URL + '/blog',
                region: AWS_CONFIG.apiGateway.REGION
            }
        ]
    }
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportwebvitals();
