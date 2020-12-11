import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {Auth} from "aws-amplify";
import {useApi, useFetch, useMediaQuery} from '../common/hook'
import {getSessionCookie, useSessionContext} from "../common/session";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import Loader from "../components/loader";
import Markdown from "../components/markdown";
import '../../scss/pages/article.scss';

const pagetitle = 'Blog'
const source = 'blog';

function MarkdownBlog(props) {
    const history = useHistory();
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} description="Spring Integration with Splunk & Log4J2"/>
            <div className="boxouter">
                <div className="container">
                    <div className="articleframe">
                        <Title message={'Spring Integration with Splunk & Log4J2'} />
                        <div className="articlettitle">{pagetitle + ' by Devadyuti Das on 10 Dec, 2020'}</div>
                        <Markdown />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MarkdownBlog;