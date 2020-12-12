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
    let blogName;
    if(props.match.params.blogName) {
        blogName = props.match.params.blogName;
    } else {
        blogName = (props.location.state && props.location.state !== undefined) ? props.location.state.blog.name : '';
    }
    const [data, loading] = usePost(
        'findBlogArticleList',
        '/blogArticleList',
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

    return (
        loading ? (
            <Loader loading={loading} />
        ) : (
            <>
                <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} description={data.title}/>
                <div className="boxouter">
                    <div className="container">
                        <div className="articleframe">
                            <Title message={data.header} />
                            <div className="articlettitle">{pagetitle + ' by ' + data.author + ' on ' + new Date(data.endDate).getDate() + " " + MONTH_NAMES[new Date(data.endDate).getMonth()] + ", " + new Date(data.endDate).getFullYear()}</div>
                            <div className="articlecontainer">
                                {data.contents.map((item, index) => (
                                    data.category === 'Travel' ? (
                                        <Document section={item} index={index} mobile={matches} />
                                    ) : (
                                        <Markdown section={item} index={index} mobile={matches} />
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    )
}

export default Article;