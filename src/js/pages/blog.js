import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, {useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {MEDIA_HOST, MONTH_NAMES} from "../common/constants";
import {postAuditEntry} from "../common/common";
import {useApi, useGet, useMediaQuery} from '../common/hook'
import {getSessionCookie} from "../common/session";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import Loader from "../components/loader";
import '../../scss/pages/blog.scss';
import Icon from "../common/icon";

const pagetitle = 'Blog'
const source = 'blog';

function Blog(props) {
    const history = useHistory();
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const [data, loading] = useGet(
        'findBlogList',
        '/blogList'
    );

    const matches = useMediaQuery('(max-width: 820px)');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'blog',
                message: 'Blog Page Accessed'
            }
        );
    }, [])

    const handleClick = (clickEvent, object) => {
        clickEvent.preventDefault();
        let blogName = object.name;
        history.push('/blog/article', {
            api: api,
            index: index,
            blog: {
                name: blogName
            }
        });
    }

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="blogframe">
                        <Title message={pagetitle} />
                        {loading ? (
                            <Loader loading={loading} />
                        ) : (
                            <ul className="bloggroup">
                                {data.map((item, index) => (
                                    <li key={index} className="blogitem" onClick={(e) => handleClick(e, item)}>
                                        <div style={{float: 'left'}}>
                                            <p className="blogheader">{item.header}</p>
                                            <div className="blogpiccontrol">
                                                <img src={MEDIA_HOST + '/images/mobile/' + item.titlePhoto} />
                                            </div>
                                            <div className="blogsummary">
                                                <p className="blogauthor">{item.category +' ' + source + ' by ' + item.author + ' on ' + new Date(item.endDate).getDate() + " " + MONTH_NAMES[new Date(item.endDate).getMonth()] + ", " + new Date(item.endDate).getFullYear()}</p>
                                                <p className="blogshare"><Icon name="view" width="1rem" height="1rem"/>&nbsp;&nbsp;{item.viewCount}&nbsp;&nbsp;<Icon name="share" width="1rem" height="1rem"/></p>
                                                <p className="blogtitle">{item.title}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Blog;