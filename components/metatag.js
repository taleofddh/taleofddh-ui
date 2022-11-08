import React from "react";
import Head from 'next/head';

function MetaTag({ page, index, url, desc }) {
    let indexMeta;
    if(!index || page === 'error') {
        indexMeta = <meta name="robots" content="noindex" />
    }
    let title;
    let description;
    let image = url + '/images/talofddh-devadyuti-debarati-deeptanal-home.jpg';
    switch(page) {
        case 'home':
            title = 'Welcome to Tale of Devadyuti, Debarati & Deeptanal\'s Home | taleofddh';
            description = 'Welcome to Tale of Devadyuti, Debarati & Deeptanal. An attempt to build a place on the web for others to know more about us.';
            break;
        case 'about-us':
            title = 'The Tale of DDH story, Our mission, journey and background';
            description = 'Meet the team behind taleofddh. We are on a mission to make the delivery of cross-border and local professional-services hassle-free and simple.';
            image = url + '/images/talofddh-devadyuti-debarati-deeptanal-home.jpg'
            break;
        case 'contact-us':
            title = 'Contact Us - Service, Support and Enquiries | taleofddh';
            description = 'Contact the taleofddh team for related queries. ' +
                'Email us for travel blogs, gallery, cooking, technical matters.';
            break;
        case 'gallery':
            title = 'Album Galleries - from Vacation, Outing, Celebration and Residence | taleofddh';
            description = 'Album Galleries - from Vacation, Outing, Celebration and Residence';
            break;
        case 'album':
            title = 'Album Collection - ' + desc + ' | taleofddh';
            description = 'Album Collection - ' + desc;
            break;
        case 'blog':
            title = 'Blog Articles - for Travel, Recipes & Technology | taleofddh';
            description = 'Blog Articles - for Travel, Recipes & Technology | taleofddh';
            break;
        case 'article':
            title = 'Blog Article - ' + desc + ' | taleofddh';
            description = 'Blog Article - ' + desc;
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
            image = url + '/images/talofddh-devadyuti-debarati-deeptanal-home.jpg';
            break;
    }
    return (
        <>
            {page === 'error' ? (
                <Head>
                    <title>{title}</title>
                    <meta charSet="UTF-8" />
                    <meta name="description" content={description} />
                    {indexMeta}
                </Head>
            ) : (
                <Head>
                    <title>{title}</title>
                    <meta charSet="UTF-8" />
                    <meta name="description" content={description} />
                    {indexMeta}
                    <meta name="keywords" content="Devadyuti, Debarati, Deeptanal, TaleofDDH"/>
                    <meta name="author" content="TaleofDDH.com"/>

                    <meta name="twitter:title" content={title} />
                    <meta name="twitter:description" content={description} />
                    <meta name="twitter:image" content={image} />
                    <meta name="twitter:card" content="summary_large_image"/>
                    <meta name="twitter:site" content="@ServEase_io"/>
                    <meta name="twitter:domain" content="https://taleofddh.com"/>
                    <meta name="twitter:creator" content="TaleofDDH_com"/>

                    <meta property="og:title" content={title} />
                    <meta property="og:description" content={description} />
                    <meta property="og:image" content={image} />
                    <meta property="og:image:secure_url" content={image} />
                    <meta property="og:image:alt" content={title} />
                    <meta property="og:site_name" content="TaleofDDH"/>
                    <meta property="og:type" content="website"/>
                    <meta property="og:url" content="https://taleofddh.com"/>
                    <meta property="og:image:type" content="image/png"/>
                    <meta property="og:image:width" content="1200"/>
                    <meta property="og:image:height" content="630"/>

                    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
                    <meta name="HandheldFriendly" content="true"/>
                </Head>
            )}

        </>
    )
}

export default MetaTag;