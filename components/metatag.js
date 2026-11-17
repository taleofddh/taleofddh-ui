import React from "react";
import Head from 'next/head';
import {DEFAULT_IMAGE} from "../common/seo";

// Single place where <head> metadata is rendered. `meta` comes from buildMeta() (common/seo.js).
// JSON-LD is serialised with "<" escaped so page content can never close the script tag.
const serializeJsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

function MetaTag({ meta }) {
    const {title, description, image, imageAlt, type, canonical, url, robots, publishedTime, jsonLd} = meta;
    return (
        <Head>
            <title>{title}</title>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
            <meta name="HandheldFriendly" content="true"/>
            <meta name="description" content={description} />
            <meta name="robots" content={robots} />
            {canonical && <link rel="canonical" href={canonical} />}
            {/* Share tags are rendered whenever the page has an image, even when it is not indexed (dev, staging),
                so link previews work there too. Utility pages (sign-in, my-account) have no image and get none. */}
            {image && (
                <>
                    <meta name="keywords" content="Devadyuti, Debarati, Deeptanal, TaleofDDH"/>
                    <meta name="author" content="TaleofDDH.com"/>
                    <meta name="twitter:card" content="summary_large_image"/>
                    <meta name="twitter:title" content={title} />
                    <meta name="twitter:description" content={description} />
                    <meta name="twitter:image" content={image} />
                    <meta name="twitter:image:alt" content={imageAlt} />
                    <meta name="twitter:site" content="@ServEase_io"/>
                    <meta name="twitter:domain" content="https://taleofddh.com"/>
                    <meta name="twitter:creator" content="TaleofDDH_com"/>
                    <meta property="og:title" content={title} />
                    <meta property="og:description" content={description} />
                    <meta property="og:image" content={image} />
                    <meta property="og:image:secure_url" content={image} />
                    <meta property="og:image:alt" content={imageAlt} />
                    {image === DEFAULT_IMAGE && (
                        <>
                            <meta property="og:image:type" content="image/png"/>
                            <meta property="og:image:width" content="1200"/>
                            <meta property="og:image:height" content="630"/>
                        </>
                    )}
                    <meta property="og:site_name" content="TaleofDDH"/>
                    <meta property="og:type" content={type}/>
                    <meta property="og:url" content={url} />
                    {publishedTime && <meta property="article:published_time" content={publishedTime} />}
                </>
            )}
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: serializeJsonLd(jsonLd)}}
                />
            )}
        </Head>
    )
}
export default MetaTag;
