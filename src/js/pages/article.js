import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { useEffect } from 'react';
import {Auth} from "aws-amplify";
import {MONTH_NAMES} from "../common/constants";
import {useApi, usePost, useMediaQuery} from '../common/hook'
import {getSessionCookie, useSessionContext} from "../common/session";
import {onError} from "../common/error";
import Document from "../components/document";
import Markdown from "../components/markdown";
import Title from "../components/title";
import Loader from "../components/loader";
import MetaTag from "../components/metatag";
import '../../scss/pages/article.scss';
import {postAuditEntry} from "../common/common";

const pagetitle = 'Blog'
const source = 'article';

function Article(props) {
    const { userHasAuthenticated } = useSessionContext();
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    let blogName = (props.location.state && props.location.state !== undefined) ? props.location.state.blog.name : '';
    const [data, loading] = usePost(
        'findArticleList',
        '/articleList',
        {blogName: blogName}
    );
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        onLoad();
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'blog article',
                message: 'Article ' + blogName + ' Page Accessed'
            }
        )
    }, [])

    async function onLoad() {
        try {
            await Auth.currentSession();
            userHasAuthenticated(true);
        }
        catch(e) {
            if (e !== 'No current user') {
                onError(e);
            }
        }
    }

    const matches = useMediaQuery('(max-width: 820px)');

    let blogDate = new Date(props.location.state.blog.endDate);
    let blogDateStr = blogDate.getDate() + " " + MONTH_NAMES[blogDate.getMonth()] + ", " + blogDate.getFullYear();

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} description={props.location.state.blog.title}/>
            <div className="boxouter">
                <div className="container">
                    <div className="articleframe">
                        <Title message={blogName + " - " + props.location.state.blog.header} />
                        <div className="articlettitle">{pagetitle + ' by ' + props.location.state.blog.author + ' on ' + blogDateStr}</div>
                        {loading ? (
                            <Loader loading={loading} />
                        ) : (
                            <div className="articlecontainer">
                                {data.map((item, index) => (
                                    props.location.state.blog.category === 'Travel' ? (
                                        <Document section={item} index={index} mobile={matches} />
                                    ) : (
                                        <Markdown section={item} index={index} mobile={matches} />
                                    )
                                ))}

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Article;