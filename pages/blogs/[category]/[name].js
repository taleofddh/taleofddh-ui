import React, {useEffect, useState} from 'react';
import {serverGet} from "../../../common/server-config";
import {
    PAGE_REVALIDATE_PERIOD,
    HOST_NAME,
    INDEX_FLAG, MONTH_NAMES
} from "../../../common/constants";
import {capitalizeFirstLetters} from "../../../common/common";
import { getSessionCookie } from "../../../common/session";
import Header from '../../../components/header';
import Navigation from '../../../components/navigation';
import ResponsiveNavigation from "../../../components/responsive-navigation";
import Footer from "../../../components/footer";
import {postAuditEntry} from "../../../common/common";
import {put} from "aws-amplify/api";
import {onError} from "../../../common/error";
import Title from "../../../components/title";
import Share from "../../../components/share";
import Markdown from "../../../components/markdown";
import Comment from "../../../components/comment";

const pageTitle = "Blogs"

function BlogName({menuList, handleLogout, authenticated, blogData, blogText, category, name, source, index, url, }) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const path = (category + '/' + name).replace(/&/g, 'and').replace(/ /g, '-').toLowerCase();

    useEffect(() => {
        postAuditEntry(
                {
                    date: new Date(),
                    hostName: window.location.hostname,
                    countryCode: ddhomeCountry.country_code,
                    ipAddress: ddhomeCountry.ip,
                    page: 'blogs',
                    message: name + ' Blog Page Accessed'
                }
        );
    }, [ddhomeCountry, name]);

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
                        },
                        body: {
                            name: name,
                            startDateTime: blogData.startDateTime
                        }
                    }
                }).response;
            }
            catch(e) {
                if (e !== 'No current user') {
                    onError(e);
                }
            }
        }
        onLoad();
    }, [name, blogData]);

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="articleframe">
                        <Title message={blogData.header} />
                        <div className="articlettitle">{pageTitle + ' by ' + blogData.author + ' on ' + new Date(blogData.endDateTime).getDate() + " " + MONTH_NAMES[new Date(blogData.endDateTime).getMonth()] + ", " + new Date(blogData.endDateTime).getFullYear()}</div>
                        <div className="articleshare">
                            <Share name={name} subject={blogData.header} url={HOST_NAME + '/articles/' + name} image={blogData.titlePhoto}/>
                        </div>
                        <div className="articlecontainer">
                            <Markdown data={blogData} text={blogText} source={source} path={path} />
                            <Comment type={pageTitle.toLowerCase()} blogName={blogData.name}/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticPaths = async ({context}) => {
    // Call an external API endpoint to get data
    const categoryNames = await serverGet('findBlogCategoryNames', '/blogCategoryNames');
    //console.log("categoryNames", JSON.stringify(categoryNames));

    let paths = []
    for(let i = 0; i < categoryNames.length; i++) {
        for (let j = 0; j < categoryNames[i].names.length; j++) {
            paths = [...paths, {
                params: {
                    category: categoryNames[i].category.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase(),
                    name: categoryNames[i].names[j].replace(/&/g, 'and').replace(/ /g, '-').toLowerCase()
                }
            }]
        }
    }
    //console.log("paths", paths);

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    // { fallback: 'blocking' } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: 'blocking' }
}

// This function gets called at build time
export const getStaticProps = async ({ context, params }) => {
    const source = 'blogs';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

    // Call an external API endpoint to get data
    const menuList = await serverGet('findMenuList', '/menuList', [true]);

    const category = capitalizeFirstLetters(`${params.category}`.replace(/-/g, ' ').replace(/ and /g, ' & '));
    const name = capitalizeFirstLetters(`${params.name}`.replace(/-/g, ' ').replace(/ and /g, ' & '));
    //console.log(category, name);
    //console.log(('images/blogs/' + category + '/' + name + '/').replace(/&/g, 'and').replace(/ /g, '-').toLowerCase());

    const blogData = await serverGet('findBlog', '/blog', [category, name]);
    //console.log(blogData);

    const hdr = capitalizeFirstLetters(`${params.name}`.replace(/-/g, ' ').replace(/ and /g, ' & ')) + ' - Blog | taleofddh';
    const desc = blogData.title;
    const img = blogData.signedUrl
    const content = blogData.content.toString();
    // Call an external API endpoint to get data
    const blogText = await serverGet('getBlogDocument', '/blogDocument', [category, content]);

    // return the data
    return {
        props: {
            menuList,
            blogData,
            blogText,
            category,
            name,
            source,
            index,
            url,
            hdr,
            desc,
            img
        },
        revalidate: PAGE_REVALIDATE_PERIOD * 48, // In seconds
    }
}

export default BlogName;