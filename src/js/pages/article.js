import React, { useEffect } from 'react';
import {Auth} from "aws-amplify";
import {MONTH_NAMES} from "../common/constants";
import {useApi, usePost, useMediaQuery, usePut} from '../common/hook'
import {getSessionCookie, useSessionContext} from "../common/session";
import {onError} from "../common/error";
import Markdown from "../components/markdown";
import Title from "../components/title";
import Loader from "../components/loader";
import MetaTag from "../components/metatag";
import {postAuditEntry} from "../common/common";
import Share from "../components/share";
import Comment from "../components/comment";
import '../../scss/pages/article.scss';

const pagetitle = 'Blog'
const source = 'article';

function Article(props) {
    const { userHasAuthenticated } = useSessionContext();
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    let blogName;
    let category;
    if(props.match.params.blogName && props.match.params.category) {
        blogName = props.match.params.blogName;
        category = props.match.params.category;
    } else {
        blogName = (props.location.state && props.location.state !== undefined) ? props.location.state.blog.name : '';
        category = (props.location.state && props.location.state !== undefined) ? props.location.state.blog.category : '';
    }
    const [countUpdate, countUpdateLoading] = usePut(
        'updateBlogViewCount',
        '/blogViewCount',
        {
            name: blogName,
            category: category
        }
    );
    const [data, loading] = usePost(
        'findBlogArticleList',
        '/blogArticleList',
        {
            category: category,
            blogName: blogName
        }
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

    return (
        loading ? (
            <Loader loading={loading || countUpdateLoading} />
        ) : (
            <>
                <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} description={data.title}/>
                <div className="boxouter">
                    <div className="container">
                        <div className="articleframe">
                            <Title message={data.header} />
                            <div className="articlettitle">{pagetitle + ' by ' + data.author + ' on ' + new Date(data.endDate).getDate() + " " + MONTH_NAMES[new Date(data.endDate).getMonth()] + ", " + new Date(data.endDate).getFullYear()}</div>
                            <div className="articleshare">
                                <Share name={blogName} subject={data.header} url={'https://www.taleofddh.com/blog/article/' + blogName} image={data.titlePhoto}/>
                            </div>
                            <div className="articlecontainer">
                                {data.contents.map((item, index) => (
                                    <Markdown section={item} key={index} />
                                ))}
                                <Comment type={pagetitle.toLowerCase()} blogName={data.name}/>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    )
}

export default Article;