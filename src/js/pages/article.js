import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import ReactHtmlParser  from 'react-html-parser';
import {MEDIA_HOST, MONTH_NAMES} from "../common/constants";
import {useApi, usePost, useMediaQuery} from '../common/hook'
import Title from "../components/title";
import Loader from "../components/loader";
import MetaTag from "../components/metatag";
import '../../scss/pages/article.scss';
import {Auth} from "aws-amplify";
import {onError} from "../common/error";
import {useSessionContext} from "../common/session";

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

    useEffect(() => {
        onLoad();
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
                            <>
                                {data.map((item, index) => (
                                    <Section key={index} section={item} index={index} mobile={matches} />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

function Section(props) {
    const isThumbnail = useMediaQuery('(max-width: 600px)');
    const isMobile = useMediaQuery('(max-width: 800px)');
    const isTablet = useMediaQuery('(max-width: 1200px)');
    let originalPath = 'desktop'
    if(isThumbnail) {
        originalPath = 'thumbnail';
    } else if (isMobile) {
        originalPath = 'mobile';
    } else if (isTablet) {
        originalPath = 'tablet';
    }
    let content;
    let text;
    if(props.section.type === 'Image') {
        content =
            <div className={props.section.styleClass}>
                <img src={MEDIA_HOST + '/images/' + originalPath + '/' + props.section.content} />
            </div>
    } else if (props.section.type === 'Text') {
        let tempMessage = props.section.content;
        let startMessage;
        let link;
        let linkText;
        let linkMessage;
        let endMessage;
        let linkStart = tempMessage.indexOf("<a")
        let linkEnd = tempMessage.indexOf("</a>");
        if(linkStart > -1) {
            if (linkStart > 0) {
                startMessage = tempMessage.substring(0, linkStart);
            }
            if(linkEnd + 5 < tempMessage.length) {
                endMessage = tempMessage.substring(linkEnd + 4, tempMessage.length)
            }
            link = tempMessage.substring(tempMessage.indexOf("href=\"") + 6, tempMessage.indexOf("\">"));
            linkText = tempMessage.substring(tempMessage.indexOf("\">") + 2, linkEnd);
            linkMessage =
                <NavLink to={link}>{linkText}</NavLink>
            content =
                <div className="article">
                    <p className={props.section.styleClass}>
                        <label>
                            {ReactHtmlParser(startMessage)}
                            {linkMessage}
                            {ReactHtmlParser(endMessage)}
                        </label>
                    </p>
                </div>
        } else {
            content =
                <div className="article">
                    <p className={props.section.styleClass}>
                        <label>
                            {ReactHtmlParser(tempMessage)}
                        </label>
                    </p>
                </div>
        }
    }

    return (
        <div className="articlecontainer">
            {content}
        </div>
    )
}

export default Article;