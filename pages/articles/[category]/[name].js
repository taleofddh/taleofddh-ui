import React, {useEffect, useState} from 'react';
import {runWithAmplifyServerContext} from "../../../common/server-config";
import { get, post } from 'aws-amplify/api/server';
import {put} from "aws-amplify/api";
import {HOST_NAME, INDEX_FLAG, MONTH_NAMES} from "../../../common/constants";
import {useIndex} from '../../../common/hook'
import {getSessionCookie, useSessionContext} from "../../../common/session";
import {onError} from "../../../common/error";
import Markdown from "../../../components/markdown";
import Title from "../../../components/title";
import Loader from "../../../components/loader";
import MetaTag from "../../../components/metatag";
import {capitalizeFirstLetters, postAuditEntry} from "../../../common/common";
import Share from "../../../components/share";
import Comment from "../../../components/comment";
import ResponsiveNavigation from "../../../components/responsive-navigation";
import Header from "../../../components/header";
import Navigation from "../../../components/navigation";
import Footer from "../../../components/footer";
import marked from "marked";

const pageTitle = 'Blog'

function Article({ menuList, handleLogout, authenticated, data, category, blogName, source, index, url }) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const [countUpdateLoading, setCountUpdateLoading] = useState(true);

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'user profile',
                message: 'User Profile Page Accessed by ' + getSessionCookie("credential").identityId
            }
        );
    }, [ddhomeCountry]);

    useEffect(() => {
        const onLoad = async () => {
            try {
                await put({
                    apiName: 'updateBlogViewCount',
                    path: '/blogViewCount',
                    options: {
                        response: true,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    },
                    body: {
                        name: blogName,
                        category: category
                    },
                }).response;
                setCountUpdateLoading(false);
            }
            catch(e) {
                if (e !== 'No current user') {
                    onError(e);
                }
                setCountUpdateLoading(false);
            }
        }
        onLoad();
    }, [blogName, category])

    return (
        countUpdateLoading ? (
            <Loader loading={countUpdateLoading} />
        ) : (
            <>
                <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
                <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
                <Navigation menus={menuList} />
                <div className="boxouter">
                    <div className="container">
                        <div className="articleframe">
                            <Title message={data.header} />
                            <div className="articlettitle">{pageTitle + ' by ' + data.author + ' on ' + new Date(data.endDate).getDate() + " " + MONTH_NAMES[new Date(data.endDate).getMonth()] + ", " + new Date(data.endDate).getFullYear()}</div>
                            <div className="articleshare">
                                <Share name={blogName} subject={data.header} url={HOST_NAME + '/articles/' + blogName} image={data.titlePhoto}/>
                            </div>
                            <div className="articlecontainer">
                                {data.contents.map((item, index) => (
                                    <Markdown section={item} key={index} />
                                ))}
                                <Comment type={pageTitle.toLowerCase()} blogName={data.name}/>
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
    const blogs = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findBlogList',
                    path: '/blogList',
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                }).response;
                return body.json();
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    });

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
    const source = 'article';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

    // Call an external API endpoint to get data
    const menuList = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findMenuList',
                    path: '/menuList/true',
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                }).response;
                return body.json();
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    });

    const category = `${params.category}`;
    const blogName = `${params.name}`;

    const data = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await post(contextSpec, {
                    apiName: 'findBlogArticleList',
                    path: '/blogArticleList',
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: {
                            category: category,
                            blogName: blogName
                        }
                    }
                }).response;
                return body.json();
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    });

    const hdr = capitalizeFirstLetters(`${params.name}`.replace(/-/g, ' ').replace(/ and /g, ' & ')) + ' | taleofddh';
    const desc = data.title;
    const img = data.titlePhoto;

    // return the data
    return {
        props: {
            menuList,
            data,
            category,
            blogName,
            source,
            index,
            url
        },
    }
}

export default Article;