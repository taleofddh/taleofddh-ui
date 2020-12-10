import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from "react";
import MetaTags from 'react-meta-tags';

function MetaTag(props) {
    let indexMeta;
    if(!props.index || props.page === 'error') {
        indexMeta = <meta name="robots" content="noindex" />
    }
    let title;
    let description;
    let image = props.url + '/images/talofddh-devadyuti-debarati-deeptanal-home.jpg';
    switch(props.page) {
        case 'home':
            title = 'Welcome to Tale of Devadyuti, Debarati & Deeptanal\'s Home | taleofddh';
            description = 'Welcome to Tale of Devadyuti, Debarati & Deeptanal. An attempt to build a place on the web for others to know more about us.';
            break;
        case 'about-us':
            title = 'The Tale of DDH story, Our mission, journey and background';
            description = 'Meet the team behind taleofddh. We are on a mission to make the delivery of cross-border and local professional-services hassle-free and simple.';
            image = props.url + '/images/talofddh-devadyuti-debarati-deeptanal-home.jpg'
            break;
        case 'contact-us':
            title = 'Contact Us - Service, Support and Enquiries | taleofddh';
            description = 'Contact the taleofddh team for related queries. ' +
                'Email us for travel blogs, gallery, cooking, technical matters.';
            break;
        case 'gallery':
            title = 'Photo Galleries - from Vacation, Outing, Celebration and Residence | taleofddh';
            description = 'Photo Galleries - from Vacation, Outing, Celebration and Residence';
            break;
        case 'album':
            title = 'Photo Album - ' + props.description + ' | taleofddh';
            description = 'Photo Album - ' + props.description;
            break;
        case 'blog':
            title = 'Blog Article - ' + props.description + ' | taleofddh';
            description = 'Blog Article - ' + props.description;
            break;
        case 'article':
            title = 'Blog Article - ' + props.description + ' | taleofddh';
            description = 'Blog Article - ' + props.description;
            break;
        case 'request':
            title = 'Track Request Status | taleofddh';
            description = 'Track status of your request. Related queries with taleofddh. ' +
                'Welcome to Tale of Devadyuti, Debarati & Deeptanal. An attempt to build a place on the web for others to know more about us.';
            break;
        case 'terms-conditions':
            title = 'Terms and Conditions | taleofddh';
            description = 'Website Terms and Conditions - Find travel, technology and cooking blogs, galleries, guides with taleofddh. ' +
                'Welcome to Tale of Devadyuti, Debarati & Deeptanal. An attempt to build a place on the web for others to know more about us.';
            break;
        default:
            title = 'Welcome to Tale of Devadyuti, Debarati & Deeptanal\'s Home | taleofddh';
            description = 'Welcome to Tale of Devadyuti, Debarati & Deeptanal. An attempt to build a place on the web for others to know more about us.';
            image = props.url + '/images/talofddh-devadyuti-debarati-deeptanal-home.jpg';
            break;
    }
    return (
        <>
            {props.page === 'error' ? (
                <MetaTags>
                    <title>{title}</title>
                    <meta name="description" content={description} />
                    {indexMeta}
                </MetaTags>
            ) : (
                <MetaTags>
                    <title>{title}</title>
                    <meta name="description" content={description} />
                    {indexMeta}

                    <meta name="twitter:title" content={title} />
                    <meta name="twitter:description" content={description} />
                    <meta name="twitter:image" content={image} />

                    <meta property="og:title" content={title} />
                    <meta property="og:description" content={description} />
                    <meta property="og:image" content={image} />
                    <meta property="og:image:secure_url" content={image} />
                    <meta property="og:image:alt" content={title} />
                </MetaTags>
            )}

        </>
    )
}

export default MetaTag;