import React, {useEffect} from 'react';
import {useRouter} from "next/router";
import Image from 'next/image';
import {runWithAmplifyServerContext} from "../common/server-config";
import {get} from "aws-amplify/api/server";
import {HOST_NAME, INDEX_FLAG, MEDIA_HOST, MONTH_NAMES} from "../common/constants";
import {postAuditEntry} from "../common/common";
import {getSessionCookie} from "../common/session";
import Title from "../components/title";
import Icon from "../common/icon";
import ResponsiveNavigation from "../components/responsive-navigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

const pageTitle = 'Blog'

function Blog({ menuList, handleLogout, authenticated, data, source, index, url }) {
    const router = useRouter();
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

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
    }, [ddhomeCountry])

    const handleClick = async (clickEvent, object) => {
        clickEvent.preventDefault();
        let blogName = object.name;
        let blogCategory = object.category;
        await router.push(object.link + '/' + blogCategory + '/' + blogName,
            object.link + '/' + blogCategory + '/'  + blogName,
    {
                index: index,
                blog: {
                    category: blogCategory,
                    name: blogName
            }
        });
    }

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="blogframe">
                        <Title message={pageTitle} />
                        <ul className="bloggroup">
                            {data.map((item, index) => (
                                <li key={index} className="blogitem" onClick={(e) => handleClick(e, item)}>
                                    <div>
                                        <p className="blogheader">{item.header}</p>
                                        <div className="blogpiccontrol">
                                            <Image src={MEDIA_HOST + '/images/mobile/' + item.titlePhoto} alt={item.titlePhoto} layout='responsive' width={3} height={2} />
                                        </div>
                                        <div className="blogsummary">
                                            <p className="blogauthor">{item.category +' ' + source + ' by ' + item.author + ' on ' + new Date(item.endDate).getDate() + " " + MONTH_NAMES[new Date(item.endDate).getMonth()] + ", " + new Date(item.endDate).getFullYear()}</p>
                                            <p className="blogtitle">{item.title}</p>
                                            <p className="blogshare"><Icon name="view" width="1rem" height="1rem" fill="rgb(255, 255, 255)"/>&nbsp;&nbsp;{item.viewCount}&nbsp;&nbsp;<Icon name="share" width="1rem" height="1rem" fill="rgb(255, 255, 255)"/></p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async (context) => {
    const source = 'blog';
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

    const data = await runWithAmplifyServerContext({
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

    // return the data
    return {
        props: {
            menuList,
            data,
            source,
            index,
            url
        },
    }
}


export default Blog;