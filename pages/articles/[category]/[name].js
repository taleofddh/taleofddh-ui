import React, {useEffect, useState} from 'react';
import {API, Auth} from "aws-amplify";
import {MONTH_NAMES} from "../../../common/constants";
import {useIndex, usePost, usePut} from '../../../common/hook'
import {getSessionCookie, useSessionContext} from "../../../common/session";
import {onError} from "../../../common/error";
import Markdown from "../../../components/markdown";
import Title from "../../../components/title";
import Loader from "../../../components/loader";
import MetaTag from "../../../components/metatag";
import {postAuditEntry} from "../../../common/common";
import Share from "../../../components/share";
import Comment from "../../../components/comment";
import ResponsiveNavigation from "../../../components/responsivenavigation";
import Header from "../../../components/header";
import Navigation from "../../../components/navigation";
import Footer from "../../../components/footer";
import marked from "marked";

const pagetitle = 'Blog'
const source = 'article';

function Article({ menuList, handleLogout, data, category, blogName }) {
    const { userHasAuthenticated } = useSessionContext();
    const index = useIndex();
    const [url, setUrl] = useState('');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const [countUpdateLoading, setCountUpdateLoading] = useState(true);

    useEffect(() => {
        if(typeof window !== 'undefined'){
            setUrl(window.location.protocol + '//' + window.location.host);
        }
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
            await API.put(
                'updateBlogViewCount',
                '/blogViewCount',
                {
                    response: true,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: {
                        name: blogName,
                        category: category
                    },
                }
            );
            await Auth.currentSession();
            userHasAuthenticated(true);
            setCountUpdateLoading(false);
        }
        catch(e) {
            if (e !== 'No current user') {
                onError(e);
            }
            setCountUpdateLoading(false);
        }
    }

    return (
        countUpdateLoading ? (
            <Loader loading={countUpdateLoading} />
        ) : (
            <>
                <ResponsiveNavigation menus={menuList} />
                <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
                <Navigation menus={menuList} />
                <MetaTag page={source} index={index} url={url} desc={data.title} img={data.titlePhoto}/>
                <div className="boxouter">
                    <div className="container">
                        <div className="articleframe">
                            <Title message={data.header} />
                            <div className="articlettitle">{pagetitle + ' by ' + data.author + ' on ' + new Date(data.endDate).getDate() + " " + MONTH_NAMES[new Date(data.endDate).getMonth()] + ", " + new Date(data.endDate).getFullYear()}</div>
                            <div className="articleshare">
                                <Share name={blogName} subject={data.header} url={'https://www.taleofddh.com/articles/' + blogName} image={data.titlePhoto}/>
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
                <Footer menus={menuList} />
            </>
        )
    )
}

// This function gets called at build time
export const getStaticPaths = async () => {
    // Call an external API endpoint to get data
    let res = await API.get(
        'findBlogList',
        '/blogList',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
    const blogs = await res.data;

    // Get the paths we want to pre-render based on posts
    const paths = blogs.map((blog) => ({
        params: { category: blog.category, name: blog.name },
    }))

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
}

// This function gets called at build time
export const getStaticProps = async ({ params }) => {
    // Call an external API endpoint to get data
    let res = await API.get(
        'findMenuList',
        '/menuList/true',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
    const menuList = await res.data;

    const category = `${params.category}`;
    const blogName = `${params.name}`;

    res = await API.post(
        'findBlogArticleList',
        '/blogArticleList',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: {
                category: category,
                blogName: blogName
            }
        }
    );
    const data = await res.data;

    // return the data
    return {
        props: {
            menuList,
            data,
            category,
            blogName
        },
    }
}

export default Article;